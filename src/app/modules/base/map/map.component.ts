import { Component, OnInit } from '@angular/core';
declare var L:  any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public drawnItems: any = null; // 存放自定义画的图层
  public startMarker: any = null;
  public endMarker: any = null;
  public map: any = null; // map对象
  public startPoint: any = null;
  public endPoint: any = null;
  public route: any = null;

  constructor() { }

  ngOnInit() {
    this.initMap();
    this.addDrawPlugin();
    this.watchAddMarker();
  }

  /**
   * 初始化map
   * */
  initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.drawnItems = L.featureGroup().addTo(this.map);

    console.log('this.drawnItems', this.drawnItems);
  }

  /**
   * 添加绘制插件到map上
   * */
  addDrawPlugin(): void {
    this.map.addControl(new L.Control.Draw({
      edit: {
        featureGroup: this.drawnItems,
        poly: {
          allowIntersection: false
        }
      },
      draw: {
        polyline: {},
        polygon: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
      }
    }));

    this.map.on(L.Draw.Event.CREATED, event => {
      const layer = event.layer;

      this.drawnItems.addLayer(layer);
    });
  }

  watchAddMarker(): void {
    this.map.on(L.Draw.Event.CREATED, e => {
      const type = e.layerType;
      const layer = e.layer;
      if (type === 'marker') {
        // Do marker specific actions
      }
      // Do whatever else you need to. (save to db; add to map etc)
      this.map.addLayer(layer);
    });
  }

  /**
   * 添加起点
   * */
  addStart(): void {
    this.map.on('click', e => {
      if (this.startPoint) {
        return;
      }
      const latlng = e.latlng;
      this.startMarker = L.marker(latlng).addTo(this.map);
      this.startPoint = latlng;
      console.log(this.startPoint);
    });
  }

  /**
   * 添加终点
   * */
  addEnd(): void {
    this.map.on('click', e => {
      if (this.endPoint) {
        return;
      }
      const latlng = e.latlng;
      this.endMarker = L.marker(latlng).addTo(this.map);
      this.endPoint = latlng;
      console.log(this.endPoint);
    });
  }

  /**
   * 生成路线
   * */
  createRoute() {
    this.route = {
      start: this.startPoint,
      end: this.endPoint
    };

    const latlngs = [
      [this.startPoint.lat, this.startPoint.lng],
      [this.endPoint.lat, this.endPoint.lng]
    ];

    this.route = L.polyline(latlngs, {color: 'red'});

    this.drawnItems.addLayer(this.route);
  }
}

