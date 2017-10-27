var coordenadas;

var app = {
    initialize: function () {
        //   this.bindEvents();

        document.addEventListener('deviceready', this.setupVue, false);
        
        var that= this;
        navigator.geolocation.getCurrentPosition(function (position) {            
            that.mapInit(position)
        }, function(error){
            console.log(error)
        })
    },
    
    mapInit: function (position) {
        //obtenemos la posicion actual del dispositivo movil en formato latitud y longitd
        this.positionCurrent = {lat: position.coords.latitude , lng: position.coords.longitude };  
         //alert("La posicion actual es:",  this.positionCurrent.text);
         this.directionsService = new google.maps.DirectionsService;
         this.directionsDisplay = new google.maps.DirectionsRenderer; 
         
         //creamos un mapa y lo centramos en la posicion del dispositivo movil
         this.map = new google.maps.Map(document.getElementById('map'),{
                                        zoom: 15,
                                        center:  this.positionCurrent
         });
         
        //seteamos las propiedades en nuestro mapa
        this.directionsDisplay.setMap(this.map);
        //calculamos y visualizamos la ruta optima
        this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay);
        
        
        
              
    },
    
    calculateAndDisplayRoute:function (directionsService, directionsDisplay) {
        var waypts = [];
        //coordenadas pinnar
        waypts.push({
            location: {lat: -24.184161848468367, lng: -65.3031125664711},
            stopover: true
        });
        //coordenadas casa de gobierno
        waypts.push({
            location: {lat: -24.1906376, lng: -65.3060652},
            stopover: true
        });
        //coordenadas de BigMall
        waypts.push({
            location: {lat: -24.1930547, lng: -65.3045392},
            stopover: true
        });
        directionsService.route({
            origin: this.positionCurrent,
            destination: this.positionCurrent,
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
            }, 
            function(response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
              var route = response.routes[0];
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
  


    },

    setupVue: function () {
       
        var vm = new Vue({
            el: "#vue-instance",
            data: {
                myTitulo: 'Calculo de la ruta mas corta',
                map: {},
                positionCurrent: {},
                markets : [],
                directionsService: {} ,
                directionsDisplay: {}
                

            },

            methods: {
                generarQR: function () {
                    //alert('creo un codigoQR con coordenadas geograficas (latitud y longitud)');
                    cordova.plugins.barcodeScanner.encode(
                        cordova.plugins.barcodeScanner.Encode.TEXT_TYPE,  //codifica en tipo de dato texto
                        "{lat:-24.184161848468367, lng:-65.3031125664711}", //coordenadas de pinnar 
                        function (success) {
                            console.log("encode success: " + success);
                        },
                        function (fail) {
                            alert("encoding failed: " + fail);
                        }
                    );



                },
                scanQR: function () {
                    //escaneo y guardo la informacion en un vector 
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            if (!result.cancelled) {
                                if (result.format == "QR_CODE") {
                                    console.log('obtenemos dato tipo texto con latitud y longitud:' + result.text);
                                    //saveCoordenada(result);
                                    this.markets.push(JSON.parse( result.text))
                                    coordenadas = coordenadas + result.text;
                                    console.log('las coordenadas guardadas son:' + coordenadas);
                                }
                            }
                        },
                        function (error) {
                            alert("Scanning failed: " + error);
                        }
                    );

                },
                testNavInterno: function () {
                    //
                    var ref = window.open('https://www.google.com', '_blank', 'location=yes');
                    ref.addEventListener('loadstart', function(event) { alert('start: ' + event.url); });
                    ref.addEventListener('loadstop', function(event) { alert('stop: ' + event.url); });
                    ref.addEventListener('loaderror', function(event) { alert('error: ' + event.message); });
                    ref.addEventListener('exit', function(event) { alert(event.type); });

                },
              
            }
        });
    }
};

app.initialize();

