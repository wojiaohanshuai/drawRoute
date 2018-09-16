import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../../core/service/common.service';
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
  public trRoute: any = null;

  public arrRoute: Array<any> = [];

  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.initMap();
    this.addDrawPlugin();
    this.watchAddMarker();
  }

  /**
   * 初始化map
   * */
  initMap(): void {
    this.map = L.map('map').setView([34.96, 108.98], 6);

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
        polyline: false,
        polygon: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
      }
    }));
  }

  /**
   * 监听draw插件的事件
   * */
  watchAddMarker(): void {
    this.map.on(L.Draw.Event.CREATED, event => {
      const layer = event.layer;

      this.drawnItems.addLayer(layer);
    });

    this.map.on(L.Draw.Event.CREATED, e => {
      const type = e.layerType;
      const layer = e.layer;
      if (type === 'marker') {
        // Do marker specific actions
      }
      // Do whatever else you need to. (save to db; add to map etc)
      this.map.addLayer(layer);
    });

    this.map.on('draw:deleted', evt => {
      this.startPoint = null;
      this.endPoint = null;
      this.route = null;
      this.arrRoute = [];
    });

    this.map.on('draw:edited', evt => {
      console.log(this.route);
      this.createTable();
    });
  }

  /**
   * 添加起点
   * */
  addStart(): void {
    this.map.on('click', this.addStartMarker);
  }

  addStartMarker = e => {
    const latlng = e.latlng;
    this.startMarker = L.marker(latlng).addTo(this.map);
    this.startPoint = latlng;
    console.log(this.startPoint);
    this.map.off('click', this.addStartMarker);
  }

  /**
   * 添加终点
   * */
  addEnd(): void {
    this.map.on('click', this.addEndMarker);
  }

  addEndMarker =  e => {
    const latlng = e.latlng;
    this.endMarker = L.marker(latlng).addTo(this.map);
    this.endPoint = latlng;
    console.log(this.endPoint);
    this.map.off('click', this.addEndMarker);
  }

  /**
   * 生成路线
   * */
  createRoute(): void {
    if (!this.startPoint || !this.endPoint) {
      this.commonService.warning('请先添加起点和终点！');
      return;
    }

    const latlngs = [
      [this.startPoint.lat, this.startPoint.lng],
      [this.endPoint.lat, this.endPoint.lng]
    ];

    this.map.removeLayer(this.startMarker);
    this.map.removeLayer(this.endMarker);
    this.route = L.polyline(latlngs, {color: 'red'});

    this.drawnItems.addLayer(this.route);

    this.createTable();
  }

  /**
   * 根据路线生成表格
   * */
  createTable(): void {
    this.arrRoute = [];

    const geoRoute = this.route.toGeoJSON();
    const arrLatlng: Array<any> = geoRoute.geometry.coordinates;

    arrLatlng.forEach((item, index) => {
      const nextPoint = arrLatlng[index + 1];
      if (nextPoint) {
        const startLatlng = L.latLng(item[1], item[0]);
        const endLatlng = L.latLng(nextPoint[1], nextPoint[0]);
        const dis = this.calcDistance(startLatlng, endLatlng);
        console.log('dis', dis);
        this.arrRoute.push({
          start: this.tofixed2(item),
          end: this.tofixed2(nextPoint),
          dis
        });
      }
    });
  }

  /**
   * 改变路线的方向,起点和终点
   * */
  reverseRoute(): void {
    if (!this.startPoint || !this.endPoint) {
      this.commonService.warning('请先添加路径！');
      return;
    }

    const start = this.startPoint;
    this.startPoint = JSON.parse(JSON.stringify(this.endPoint));
    this.endPoint = start;


    const geoRoute = this.route.toGeoJSON();

    console.log(geoRoute);
    const arrLatlng: Array<any> = geoRoute.geometry.coordinates.reverse();

    const latlngs = [];
    arrLatlng.forEach((item, index) => {
        latlngs.push([item[1], item[0]]);
    });
    this.drawnItems.removeLayer(this.route);
    this.route = L.polyline(latlngs, {color: 'red'});
    this.drawnItems.addLayer(this.route);

    this.createTable();
  }

  trEnter(item) {
    const start = item.start;
    const end = item.end;

    const latlngs = [
      [start[1], start[0]],
      [end[1], end[0]]
    ];

    this.trRoute = L.polyline(latlngs, {color: 'blue'});

    this.map.addLayer(this.trRoute);
  }

  trLeave() {
    this.map.removeLayer(this.trRoute);
  }

  /**
   * 计算距离
   * */
  calcDistance(start: any, end: any): number {

    console.log('this.map.distance(start, end)', this.map.distance(start, end))
    return this.map.distance(start, end);
  }

  /**
   * 保留2位小数
   * */
  tofixed2(arr: Array<any>): Array<any> {
    return arr.map(item => item.toFixed(2));
  }

  /**
   * 数组转字符
   * */
  toString(arr: Array<number>): string {
    return `[ ${arr[1]}, ${arr[0]} ]`;
  }
}

