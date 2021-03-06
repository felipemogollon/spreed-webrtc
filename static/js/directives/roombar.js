/*
 * Spreed WebRTC.
 * Copyright (C) 2013-2014 struktur AG
 *
 * This file is part of Spreed WebRTC.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

"use strict";
define(['underscore', 'angular', 'text!partials/roombar.html'], function(_, angular, template) {

	// roomBar
	return ["$window", "rooms", "$timeout", "safeApply", function($window, rooms, $timeout, safeApply) {

		var link = function($scope, $element) {

			var clearRoomName = function() {
				$scope.currentRoomName = null;
				$scope.newRoomName = "";
			};

			//console.log("roomBar directive link", arguments);
			//$scope.layout.roombar = true;

			$scope.save = function() {
				if ($scope.roombarform.$invalid) {
					return;
				}
				var roomName = rooms.joinByName($scope.newRoomName);
				if (roomName !== $scope.currentRoomName) {
					$scope.roombarform.$setPristine();
				}
			};

			$scope.exit = function() {
				$scope.newRoomName = "";
				$scope.save();
			};

			$scope.$on("room.updated", function(ev, room) {
				safeApply($scope, function(scope) {
					scope.currentRoomName = scope.newRoomName = room.Name;
					if (scope.currentRoomName && !scope.peer) {
						scope.layout.roombar = true;
					}
				});
			});

			$scope.$on("room.left", function() {
				safeApply($scope, clearRoomName);
			});

			$scope.$watch("newRoomName", function(name) {
				if (name === $scope.currentRoomName) {
					$scope.roombarform.$setPristine();
				}
			});

			$scope.$watch("layout.roombar", function(value) {
				$timeout(function() {
					$element.find("input").focus();
				});
			});

			$scope.$watch("peer", function(peer) {
				$scope.layout.roombar = !peer;
			});

			clearRoomName();
		};

		return {
			restrict: 'E',
			replace: true,
			scope: true,
			template: template,
			link: link
		}

	}];

});
