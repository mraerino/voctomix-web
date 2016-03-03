'use strict';

/**
 * @ngdoc function
 * @name voctomixWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the voctomixWebApp
 */
angular.module('voctomixWebApp')
  .controller('MainCtrl', function($scope, Websock) {
      $scope.server_config = {};
      $scope.topo = {
        sources: []
      };
      $scope.state = {
        a: '', b: '',
        composite_mode: 'fullscreen'
      };
      $scope.mix_modes = [
        {
          name: "Fullscreen",
          icon: 'crop_landscape',
          ident: 'fullscreen'
        },
        {
          name: "Picture in picture",
          icon: 'picture_in_picture_alt',
          ident: 'side_by_side_preview'
        },
        {
          name: "Side by side",
          icon: 'chrome_reader_mode',
          ident: 'side_by_side_equal'
        }
      ];

      $scope.ws = new Websock()();
      $scope.ws.on('open', function() {
        console.log("Connection opened.");
        $scope.ws.send_string("get_config\n");
        $scope.ws.send_string("get_video\n");
        $scope.ws.send_string("get_composite_mode\n");
      });
      $scope.ws.on('close', function() {
        console.log("Connection closed.");
      });
      $scope.ws.on('message', function() {
        var stack = $scope.ws.rQshiftStr().split('\n');
        angular.forEach(stack, function(msg) {
          if(msg.startsWith('server_config ')) {
            var config_json = msg.substr(('server_config ').length);
            $scope.server_config = angular.fromJson(config_json);
            $scope.topo.sources = $scope.server_config.mix.sources.split(',');
            $scope.$apply();
          } else if(msg.startsWith('video_status ')) {
            var state = msg.substr(('video_status ').length).split(' ');
            $scope.state.a = state[0];
            $scope.state.b = state[1];
            $scope.$apply();
          } else if(msg.startsWith('composite_mode ')) {
            var cpmode = msg.substr(('composite_mode ').length);
            $scope.state.composite_mode = cpmode;
            $scope.$apply();
          }
        });
      });
      $scope.ws.open("ws://localhost:8000/");

      $scope.select_source = function(layer, source) {
        var layerstr = 'a';
        if(layer == 'b') layerstr = 'b';

        $scope.ws.send_string('set_video_'+layerstr+' '+source+'\n');
      };
      $scope.set_composite_mode = function(mode) {
        $scope.ws.send_string('set_composite_mode '+mode+'\n');
      };
  });
