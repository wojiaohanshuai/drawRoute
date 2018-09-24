import { Injectable } from '@angular/core';

@Injectable()
export class MapService {

  public signs: Array<any> = [
    {
      name: 'Pedestrian Movement',
      iconUrl: 'assets/image/pedestrianMovement.jpg',
      type: 'pedestrianMovement'
    },
    {
      name: 'Barrier Boards',
      iconUrl: 'assets/image/barrierBoards.jpg',
      type: 'barrierBoards'
    },
    {
      name: 'Traffic Cones',
      iconUrl: 'assets/image/trafficControllerSign.jpg',
      type: 'trafficControllerSign'
    },
    {
      name: 'Variable Message Boards',
      iconUrl: 'assets/image/variableMessageBoards.jpg',
      type: 'variableMessageBoards'
    },
    {
      name: 'Authorised Traffic Controller',
      iconUrl: 'assets/image/authorisedTrafficController.jpg',
      type: 'authorisedTrafficController'
    },
    {
      name: 'Roadworks ahead Sign',
      iconUrl: 'assets/image/roadworksAheadSign.jpg',
      type: 'roadworksAheadSign'
    },
    {
      name: 'Roadworks Sign',
      iconUrl: 'assets/image/roadworksSign.jpg',
      type: 'roadworksSign'
    },
    {
      name: 'On Side Road Sign',
      iconUrl: 'assets/image/onSideRoadSign.jpg',
      type: 'onSideRoadSign'
    },
    {
      name: 'Traffic Controller Sign',
      iconUrl: 'assets/image/trafficControllerSign.jpg',
      type: 'trafficControllerSign'
    },
    {
      name: 'Prepare to Stop Sign',
      iconUrl: 'assets/image/prepareToStopSign.jpg',
      type: 'prepareToStopSign'
    },
    {
      name: 'Detour Ahead Sign',
      iconUrl: 'assets/image/detourAheadSign.jpg',
      type: 'detourAheadSign'
    },
    {
      name: 'Detour Sign',
      iconUrl: 'assets/image/detourSign.jpg',
      type: 'detourSign'
    },
    {
      name: 'Parking Sign',
      iconUrl: 'assets/image/parkingSign.jpg',
      type: 'parkingSign'
    }
  ];

  constructor() { }

}
