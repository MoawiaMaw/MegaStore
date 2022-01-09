angular.module("myApp", ["ngRoute", "mds"])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "templates/login.html",
                controller: "loginCtrl",
                css: "css/style (2).css"
            })
            .when("/login", {
                templateUrl: "templates/login.html",
                controller: "loginCtrl",
                css: "css/style (2).css"
            })
            .when("/store", {
                templateUrl: "templates/store.html",
                controller: "storeCtrl"
            })
            .when("/cart", {
                templateUrl: "templates/cart.html",
                controller: "cartCtrl"
            })
            .when("/orders", {
                templateUrl: "templates/orders.html",
                controller: "ordersCtrl"
            })
            .when("/logout", {
                template: "",
                controller: "logoutCtrl"
            })
    })
    .controller("loginCtrl", function ($scope, $rootScope, $http, $http2, $location) {
        function getAdmin() {
            $http2.get("api/getAdmin.php")
                .then(function (response) {
                    $rootScope.adName = response.data[0].name
                    $rootScope.adPassword = response.data[0].password
                    $rootScope.isLoggedIn = response.data[0].loggedIn
                    $scope.$apply()
                })
        }

        getAdmin()
        $scope.checkAdmin = function () {
            if ($scope.name == $scope.adName && $scope.password == $scope.adPassword) {

                $http.post("api/login.php", {
                    name: $scope.name,
                    password: $scope.password
                }).then(function (response) {
                    if (response.data.status) {

                        alert("logged in");
                        $location.path('store')
                        getAdmin()
                    }
                })



            } else {
                alert("name or password might be wrong");
                $scope.password = ""
            }

        }

    })

    .controller("storeCtrl", function ($scope, $rootScope, $http, $http2, $location) {

        function getProducts() {

            $http2.get("api/getProducts.php")
                .then(function (response) {

                    $scope.products = response.data

                })
        }
        getProducts();
        function getAdmin() {
            $http2.get("api/getAdmin.php")
                .then(function (response) {
                    $rootScope.adName = response.data[0].name
                    $rootScope.adPassword = response.data[0].password
                    $rootScope.isLoggedIn = response.data[0].loggedIn
                    $scope.$apply()
                })
        }
        getAdmin()

        $scope.showForm = function () {

            $(".well").slideToggle("fast")

        }
        $rootScope.showInfo = function () {
            $("#id")
        }
        $scope.addProduct = function () {

            $http2.post("http://localhost/finalProject/api/addProduct.php", {
                name: $scope.name,
                section: $scope.section,
                quantity: $scope.quantity,
                price: $scope.price,
                description: $scope.description,
                image: $scope.x
            }).then(function (response) {
                if (response.data.status) {
                    getProducts()
                    alert("you added a new product successfully")
                    $scope.name = ""
                    $scope.section = ""
                    $scope.quantity = ""
                    $scope.price = ""
                    $scope.description = ""
                    $scope.y = ""
                    $scope.$apply()
                } else {
                    alert("failed to add a product ")
                }
            })
            getProducts()
        }

        //Handle Cart
        // $rootScope.cart = []

        //Get Cart from the Darabase
        // $scope.getCart = function () {
        //     $http2.get("api/getCart.php").then(function (response) {
        //         $rootScope.cart = response.data
        //         $rootScope.$apply()
        //     })
        // }

        //Add To Cart 
        $scope.addToCart = function (product) {
            $http2.get("api/getCart.php").then(function (response) {
                $rootScope.cart = response.data
                console.log($rootScope.cart)
                if (!$rootScope.cart.length) {

                    $http2.post('./api/addToCart.php', {
                        id: product.id,
                        name: product.name,
                        section: product.section,
                        price: product.price,
                        image: product.image,

                    }).then(function (response) {
                        if (response.status) {
                            console.log("success")
                        }

                    })
                } else {
                    setTimeout(() => {
                        console.log($rootScope.cart)
                        var x = $rootScope.cart.filter(x => x.product_id == product.id);
                        console.log(x)
                        if (x.length != 0) {
                            $scope.available = true
                        } else {
                            $scope.available = false
                        }

                        if ($scope.available) {
                            console.log(product.id, product.price)
                            $http2.post("api/updateCart.php", {
                                id: product.id,
                                price: product.price
                            }).then(function (response) {
                                if (response.data.status) {
                                    console.log("updated")
                                    $scope.available = false
                                }
                            })
                        } else if (!$scope.available) {
                            console.log("no match")
                            $http2.post('./api/addToCart.php', {
                                id: product.id,
                                name: product.name,
                                section: product.section,
                                price: product.price,
                                image: product.image,

                            }).then(function (response) {
                                if (response.status) {
                                    console.log("success")

                                }

                            })
                        }


                    }, 300)

                }

            })








        }


        $scope.deleteProduct = function (product) {
            var check = confirm("are you sure ?")
            if (check) {
                $http.post("api/deleteProduct.php", {
                    id: product.id
                }).then(function (resp) {
                    if (resp) {
                        alert("product deleted successfully!")
                    }
                })
                getProducts()
            }

        }
        //pre edit product
        $scope.preEdit = function (product, index) {
            $scope.selectedProduct = angular.copy(product)
            $scope.selectedProductIndex = index
            $scope.selectedProduct.price = parseInt($scope.selectedProduct.price)
            $scope.selectedProduct.quantity = parseInt($scope.selectedProduct.quantity)

            $("#myModal").modal("show")
        }
        // update product
        $scope.editProduct = function () {
            var check = confirm("Sure to update product ?")
            if (check) {
                $http.post("api/updateProduct.php", $scope.selectedProduct)
                    .then(function (resp) {
                        if (resp.data.status) {
                            alert("product updated successfully")
                            getProducts()
                            $scope.products[$scope.selectedProductIndex] = $scope.selectedProduct;
                            $("#myModal").modal("hide")
                        }
                    })
            }
        }

        //editImage
        $scope.preEditProductImage = function (file, id) {
            var check = confirm("Sure to change Product image ?")
            if (check) {
                $http2.post("api/editProductImage.php", {
                    id: id,
                    image: file
                }).then(function (resp) {
                    if (resp.data.status) {
                        getProducts()
                        alert("Product image updated successfully")
                        $scope.$apply()
                    }
                    else {
                        alert("Failed to update product image")
                    }
                })
            }
        }

    })
    .controller("ordersCtrl", function ($scope, $rootScope, $http, $http2) {
        function getAdmin() {
            $http2.get("api/getAdmin.php")
                .then(function (response) {
                    $rootScope.adName = response.data[0].name
                    $rootScope.adPassword = response.data[0].password
                    $rootScope.isLoggedIn = response.data[0].loggedIn
                    $scope.$apply()
                })
        }
        getAdmin()

        $http.get("api/getOrders.php")
            .then(function (response) {

                $rootScope.orders = response.data

            })


    })
    .controller("cartCtrl", function ($scope, $rootScope, $http, $http2) {
        function getAdmin() {
            $http2.get("api/getAdmin.php")
                .then(function (response) {
                    $rootScope.adName = response.data[0].name
                    $rootScope.adPassword = response.data[0].password
                    $rootScope.isLoggedIn = response.data[0].loggedIn
                    $scope.$apply()
                })
        }
        getAdmin()

        $http2.get("api/getProducts.php")
            .then(function (response) {

                $scope.products = response.data

            })

        $scope.getCart = function () {
            $http2.get("api/getCart.php").then((response) => {
                $scope.cart = response.data.cart
                $scope.prices = response.data.prices
                $scope.total_price = 0
                $scope.prices.forEach((price) => {
                    $scope.total_price += parseInt(price.price)
                })
                $scope.$apply()
                console.log($scope.total_price)
            })
        }

        $scope.getCart()
        $scope.incrementProduct = function (product) {
            $scope.products.forEach((item) => {
                if (item.id == product.product_id) {
                    $scope.productPrice = item.price
                }
            })
            $http2.post("api/incrementProduct.php", {
                id: product.id,
                price: $scope.productPrice
            }).then(function (response) {
                if (response.data.status) {
                    console.log("incremented")
                    $scope.getCart()
                }
            })
        }

        $scope.decrementProduct = function (product) {

            $scope.products.forEach((item) => {
                if (item.id == product.product_id) {
                    $scope.productPrice = item.price
                }
            })
            if (product.quantity == 1) {
                console.log("you gonna reach zero")
            } else {
                $http2.post("api/decrementProduct.php", {
                    id: product.id,
                    price: $scope.productPrice
                }).then(function (response) {
                    if (response.data.status) {

                        console.log("decremented")
                        $scope.getCart()
                    }
                })
            }
        }

        $scope.removeProduct = function(product){

            $http2.post("api/deleteCartProduct",{
                id:product.id
            }).then(function(response){
                
            })

        }


    })
    .controller("logoutCtrl", function ($scope, $rootScope, $http, $http2, $location) {


        $http.post("api/logout.php")
            .then(function (response) {

                if (response.data.status) {
                    $location.path('')
                }
            })


    })
    .filter("sectionFilter", function ($rootScope) {

        return function (products, productSection) {

            var out = []

            if (productSection == "phones") {
                products.forEach(function (product) {
                    if (product.section == "phones")
                        out.push(product)
                })
            }
            else if (productSection == "laptops") {
                products.forEach(function (product) {
                    if (product.section == "laptops")
                        out.push(product)
                })
            }
            else if (productSection == "electrics") {
                products.forEach(function (product) {
                    if (product.section == "electrics")
                        out.push(product)
                })
            }
            return out
        }

    })
    .directive('head', ['$rootScope', '$compile',
        function ($rootScope, $compile) {
            return {
                restrict: 'E',
                link: function (scope, elem) {
                    var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
                    elem.append($compile(html)(scope));
                    scope.routeStyles = {};
                    $rootScope.$on('$routeChangeStart', function (e, next, current) {
                        if (current && current.$$route && current.$$route.css) {
                            if (!angular.isArray(current.$$route.css)) {
                                current.$$route.css = [current.$$route.css];
                            }
                            angular.forEach(current.$$route.css, function (sheet) {
                                delete scope.routeStyles[sheet];
                            });
                        }
                        if (next && next.$$route && next.$$route.css) {
                            if (!angular.isArray(next.$$route.css)) {
                                next.$$route.css = [next.$$route.css];
                            }
                            angular.forEach(next.$$route.css, function (sheet) {
                                scope.routeStyles[sheet] = sheet;
                            });
                        }
                    });
                }
            };
        }
    ]);

