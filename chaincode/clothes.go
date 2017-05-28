package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

//var logger = shim.NewLogger("CLDChaincode")

//==============================================================================================================================
//	 Participant types - Each participant type is mapped to an integer which we use to compare to the value stored in a
//						 user's eCert
//==============================================================================================================================
//CURRENT WORKAROUND USES ROLES CHANGE WHEN OWN USERS CAN BE CREATED SO THAT IT READ 1, 2, 3, 4, 5
const AUTHORITY = "regulator"
const FABRIC = "fabric"
const SHIPPING_COMP = "shipping_comp"
const RETAIL = "retail"

//==============================================================================================================================
//	 Status types - Asset lifecycle is broken down into 5 statuses, this is part of the business logic to determine what can
//					be done to the vehicle at points in it's lifecycle
//==============================================================================================================================
const STATE_INI = 0
const STATE_FABRIC = 1
const STATE_AUTHORITY = 2
const STATE_SHIPPING = 3
const STATE_RETAIL = 4

//==============================================================================================================================
//	 Structure Definitions
//==============================================================================================================================
//	Chaincode - A blank struct for use with Shim (A HyperLedger included go file used for get/put state
//				and other HyperLedger functions)
//==============================================================================================================================
type SimpleChaincode struct {
}

var clothesIndexStr = "_clothesindex" //name for the key/value that will store a list of all known clothes
//var openTradesStr = "_opentrades"				//name for the key/value that will store all open trades

//==============================================================================================================================
//	Clothes - Defines the structure for a car object. JSON on right tells it what JSON fields to map to
//			  that element when reading a JSON object into the struct e.g. JSON make -> Struct Make.
//==============================================================================================================================
type Clothes struct {
	ClothesID    string `json:"ClothesID"`
	Status       string `json:"Status"`
	Owner        string `json:"Owner"`
	ClothesType  string `json:"ClothesType"`
	Color        string `json:"Color"`
	Size         string `json:"Size"`
	Feedstock    string `json:"Feedstock"`
	SuppName     string `json:"SuppName"`
	SuppCity     string `json:"SuppCity"`
	SuppCountry  string `json:"SuppCountry"`
	SuppProdDate string `json:"SuppProdDate"`
}

type Fabric struct {
	FabricID int    `json:"FabricID"`
	Name     string `json:"Name"`
	CNPJ     string `json:"CNPJ"`
	Cert1    string `json:"Cert1"`
	Cert2    string `json:"Cert2"`
	Cert3    string `json:"Cert3"`
	City     string `json:"City"`
	Country  string `json:"Country"`
}

type Certifier struct {
	CertifierID int    `json:"CertifierID"`
	Name        string `json:"Name"`
	CNPJ        string `json:"CNPJ"`
	City        string `json:"City"`
	Country     string `json:"Country"`
}

type Transporter struct {
	TransporterID int    `json:"TransporterID"`
	Name          string `json:"Name"`
	CNPJ          string `json:"CNPJ"`
	City          string `json:"City"`
	Country       string `json:"Country"`
}

type Retail struct {
	RetailID int    `json:"RetailID"`
	Name     string `json:"Name"`
	CNPJ     string `json:"CNPJ"`
	City     string `json:"City"`
	Country  string `json:"Country"`
}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

// ============================================================================================================================
// Init - reset all the things
// ============================================================================================================================
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	var Aval int
	var err error

	if len(args) != 11 {
		return nil, errors.New("Incorrect number of arguments. Expecting 11")
	}

	// Initialize the chaincode
	Aval, err = strconv.Atoi(args[0])
	if err != nil {
		return nil, errors.New("Expecting integer value for asset holding")
	}

	// Write the state to the ledger
	err = stub.PutState("abc", []byte(strconv.Itoa(Aval))) //making a test var "abc", I find it handy to read/write to it right away to test the network
	if err != nil {
		return nil, err
	}

	var empty []string
	jsonAsBytes, _ := json.Marshal(empty) //marshal an emtpy array of strings to clear the index
	err = stub.PutState(clothesIndexStr, jsonAsBytes)
	if err != nil {
		return nil, err
	}

	return nil, nil
}

func (t *SimpleChaincode) init_clothes(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error

	//   0       1       2     3
	// "asdf", "blue", "35", "bob"
	if len(args) != 11 {
		return nil, errors.New("Incorrect number of arguments. Expecting 11")
	}

	//input sanitation
	fmt.Println("- start init clothes")
	if len(args[0]) <= 0 {
		return nil, errors.New("1st argument must be a non-empty string")
	}
	if len(args[1]) <= 0 {
		return nil, errors.New("2nd argument must be a non-empty string")
	}
	if len(args[2]) <= 0 {
		return nil, errors.New("3rd argument must be a non-empty string")
	}
	if len(args[3]) <= 0 {
		return nil, errors.New("4th argument must be a non-empty string")
	}
	if len(args[4]) <= 0 {
		return nil, errors.New("5th argument must be a non-empty string")
	}
	if len(args[5]) <= 0 {
		return nil, errors.New("6th argument must be a non-empty string")
	}
	if len(args[6]) <= 0 {
		return nil, errors.New("7th argument must be a non-empty string")
	}
	if len(args[7]) <= 0 {
		return nil, errors.New("8th argument must be a non-empty string")
	}
	if len(args[8]) <= 0 {
		return nil, errors.New("9th argument must be a non-empty string")
	}
	if len(args[9]) <= 0 {
		return nil, errors.New("10th argument must be a non-empty string")
	}
	if len(args[10]) <= 0 {
		return nil, errors.New("11th argument must be a non-empty string")
	}

	clothesID := strings.ToLower(args[0])
	status := strings.ToLower(args[1])
	owner := strings.ToLower(args[2])
	clothesType := strings.ToLower(args[3])
	color := strings.ToLower(args[4])
	size := strings.ToLower(args[5])
	feedstock := strings.ToLower(args[6])
	suppName := strings.ToLower(args[7])
	suppCity := strings.ToLower(args[8])
	suppCountry := strings.ToLower(args[9])
	suppProdDate := strings.ToLower(args[10])

	//check if marble already exists
	clotAsBytes, err := stub.GetState(clothesID)
	if err != nil {
		return nil, errors.New("Failed to get clothes ID")
	}
	res := Clothes{}
	json.Unmarshal(clotAsBytes, &res)
	if res.ClothesID == clothesID {
		fmt.Println("This clothes arleady exists: " + clothesID)
		fmt.Println(res)
		return nil, errors.New("This clothes arleady exists") //all stop a marble by this name exists
	}

	//build the marble json string manually
	str := `{"clothesID": "` + clothesID + `", "status": "` + status + `", "owner": ` + owner + `, "clothesType": "` + clothesType + `", "color": "` + color + `", "size": "` + size + `", "feedstock": "` + feedstock + `", "suppName": "` + suppName + `", "suppCity": "` + suppCity + `", "suppCountry": "` + suppCountry + `", "suppProdDate": "` + suppProdDate + `"}`
	err = stub.PutState(clothesID, []byte(str)) //store marble with id as key
	if err != nil {
		return nil, err
	}

	//get the marble index
	clothesAsBytes, err := stub.GetState(clothesIndexStr)
	if err != nil {
		return nil, errors.New("Failed to get clothes index")
	}
	var clothesIndex []string
	json.Unmarshal(clothesAsBytes, &clothesIndex) //un stringify it aka JSON.parse()

	//append
	clothesIndex = append(clothesIndex, clothesID) //add marble name to index list
	fmt.Println("! clothes index: ", clothesIndex)
	jsonAsBytes, _ := json.Marshal(clothesIndex)
	err = stub.PutState(clothesIndexStr, jsonAsBytes) //store name of marble

	fmt.Println("- end init clothes")
	return nil, nil
}

// ============================================================================================================================
// Run - Our entry point for Invocations - [LEGACY] obc-peer 4/25/2016
// ============================================================================================================================
func (t *SimpleChaincode) Run(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("run is running " + function)
	return t.Invoke(stub, function, args)
}

// ============================================================================================================================
// Invoke - Our entry point for Invocations
// ============================================================================================================================
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "init_clothes" { //initialize the chaincode state, used as reset
		return t.init_clothes(stub, args)
	} else if function == "write" {
		return t.write(stub, args)
	} else if function == "set_owner" {
		return t.set_owner(stub, args)
	}

	fmt.Println("invoke did not find func: " + function) //error

	return nil, errors.New("Received unknown function invocation")
}

// ============================================================================================================================
// Query - Our entry point for Queries
// ============================================================================================================================
func (t *SimpleChaincode) Query(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("query is running " + function)

	// Handle different functions
	if function == "read" { //read a variable
		return t.read(stub, args)
	}
	fmt.Println("query did not find func: " + function) //error

	return nil, errors.New("Received unknown function query")
}

// ============================================================================================================================
// Read - read a variable from chaincode state
// ============================================================================================================================
func (t *SimpleChaincode) read(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var clothesId, jsonResp string
	var err error

	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting name of the var to query")
	}

	clothesId = args[0]
	fmt.Println("clothes id: " + clothesId)
	valAsbytes, err := stub.GetState(clothesId) //get the var from chaincode state
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + clothesId + "\"}"
		return nil, errors.New(jsonResp)
	}

	return valAsbytes, nil //send it onward
}

//Function write
func (t *SimpleChaincode) write(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var clothesId, value string
	var err error
	fmt.Println("running write()")

	if len(args) != 2 {
		return nil, errors.New("Incorrect number of arguments. Expecting 2. name of the variable and value to set")
	}

	clothesId = args[0] //rename for fun
	value = args[1]
	err = stub.PutState(clothesId, []byte(value)) //write the variable into the chaincode state
	if err != nil {
		return nil, err
	}

	return nil, nil
}

// ============================================================================================================================
// Set Owner
// ============================================================================================================================
func (t *SimpleChaincode) set_owner(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error

	//   0       1
	if len(args) < 2 {
		return nil, errors.New("Incorrect number of arguments. Expecting 2")
	}

	fmt.Println("- start set owner")
	fmt.Println(args[0] + " - " + args[1])
	clotAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return nil, errors.New("Failed to get thing")
	}
	res := Clothes{}
	json.Unmarshal(clotAsBytes, &res) //un stringify it aka JSON.parse()
	res.Owner = args[1]               //change the user

	jsonAsBytes, _ := json.Marshal(res)
	err = stub.PutState(args[0], jsonAsBytes) //rewrite the clothes with id as key
	if err != nil {
		return nil, err
	}

	fmt.Println("- end set owner")
	return nil, nil
}
