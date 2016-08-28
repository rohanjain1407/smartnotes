window.onload =  function () {
	//Function to set Text Box with set Jira Domain
	chrome.runtime.sendMessage({type: "get_startup_properties"}, function (response) {
		if(response.type == "Error") {
			console.log("Error: "+ response.emsg);
			document.getElementById('user_domain').value = "";
		}
		console.log("Setting Text with value: " + response.user_domain);
		document.getElementById('user_domain').value = response.user_domain;
        loadPopupBody(response.valid_domain, response.user_authentication);

	});

	document.getElementById('set_domain').onclick = function () {
		var user_domain = document.getElementById('user_domain').value;
		chrome.runtime.sendMessage({type: "set_domain", user_domain: user_domain}, function (response) {
			if(response.type == "Error") {
				console.log("Error: " + response.emsg);
				console.log("Resetting the user domain");
				chrome.runtime.sendMessage({type: "get_startup_properties"}, function (response) {
					if(response.type == "Error") {
						document.getElementById('user_domain').value = "";
					} else {
						document.getElementById('user_domain').value = response.user_domain;
					}
				});
			}
		});
	};

    document.getElementById('loginButton').onclick = function () {
        var domain = "http://"+document.getElementById('user_domain').value;
        window.open(domain);
    };
};

chrome.runtime.onMessage.addListener(function (request) {
    if(request.type == "refresh_popup") {
        loadPopupBody(request.valid_domain, request.user_authentication);
    }
});

function loadPopupBody(isValidDomain, isAuthenticated) {
	
    if (isValidDomain == true) {
        document.getElementById('imgDomainVerified').className = "visible";
        document.getElementById('imgDomainUnverified').className = "invisible";
    }
    else {
        document.getElementById('imgDomainVerified').className = "invisible";
         document.getElementById('imgDomainUnverified').className = "visible";
    }

    if (isAuthenticated == true) {
         document.getElementById('imgAuthVerified').className = "visible";
         document.getElementById('imgAuthUnverified').className = "invisible";
    }
    else {
         document.getElementById('imgAuthVerified').className = "invisible";
         document.getElementById('imgAuthUnverified').className = "visible";
    }

    if (isValidDomain == true && isAuthenticated == false) {
        document.getElementById('loginButton').className = "visible";
    }
    else {
        document.getElementById('loginButton').className = "invisible";
    }
}
