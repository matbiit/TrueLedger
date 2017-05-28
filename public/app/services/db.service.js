app.service("DBService", function($http) {

  this.createChain = function(aChain) {

		return $http({
			method: 'POST',
			url: "/api/createchain",
			data: {
				type: aChain.type,
        status: aChain.status,
        color: aChain.color,
        size: aChain.size,
        feedstock: aChain.feedstock,
        suppName: aChain.suppName,
        suppCity: aChain.suppCity,
        suppCountry: aChain.suppCountry,
        suppProDate: aChain.suppProDate
			}
		});

	}

  this.getMyAssets = function(aId) {

		return $http({
			method: 'GET',
			url: "/api/myassets",
			params: {
				myId: aId
			}
		});

	}

  this.getHistory = function(aId) {

		return $http({
			method: 'GET',
			url: "/api/gethistory",
			params: {
				id: aId
			}
		});

	}

  this.transferAsset = function(aId) {

    console.log(aId);

		return $http({
			method: 'POST',
			url: "/api/passit",
			body: {
				hash: aId,
        myId: "f5d535fda863561e448cd355bdbd9154",
        next: "297f3bb906b4b1e90d86a0169e606790"
			}
		});

	}

})
