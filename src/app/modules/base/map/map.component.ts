import {Component, ElementRef, OnInit} from '@angular/core';
import {CommonService} from '../../../core/service/common.service';
import {MapService} from './service/map.service';
import { saveAs } from 'file-saver/FileSaver';
declare var L:  any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public drawnItems: any = null; // 存放自定义画的图层
  public signItems: any = null; // 存放sign marker的图层
  public startMarker: any = null;
  public endMarker: any = null;
  public map: any = null; // map对象
  public startPoint: any = null;
  public endPoint: any = null;
  public route: any = null;
  public trRoute: any = null; // 表格中每一行表示路径的一段距离

  public arrRoute: Array<any> = [];

  public selectedSign: any;
  public SIGNS: Array<any> = this.mapService.signs; // 所有的标志
  public signMarkerArray: Array<any> = [];

  constructor(
    private commonService: CommonService,
    private mapService: MapService,
    public element: ElementRef
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
    this.signItems = L.featureGroup().addTo(this.map);

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
      const layers = evt.layers._layers;
      let layer;
      for (const i in layers) {
        if (layers.hasOwnProperty(i)) {
          layer = layers[i];
        }
      }

      if (layer instanceof  L.Polyline) {
        this.startPoint = null;
        this.endPoint = null;
        this.arrRoute = [];
        this.drawnItems.removeLayer(this.route);
        this.route = null;

        console.log(this.route);
      } else if (layer instanceof L.Marker) {
        this.removeSign(layer);
      }
    });

    this.map.on('draw:edited', evt => {
      console.log(this.route);

      const layers = evt.layers._layers;
      let layer;
      for (const i in layers) {
        if (layers.hasOwnProperty(i)) {
          layer = layers[i];
        }
      }

      if (layer instanceof  L.Polyline) {
        this.createTable();
      } else if (layer instanceof L.Marker) {
        this.editSign(layer);
      }

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

    this.startMarker && this.map.removeLayer(this.startMarker);
    this.endMarker && this.map.removeLayer(this.endMarker);
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

  /**
   * 表格行鼠标进入
   * */
  trEnter(item): void {
    const start = item.start;
    const end = item.end;

    const latlngs = [
      [start[1], start[0]],
      [end[1], end[0]]
    ];

    this.trRoute = L.polyline(latlngs, {color: 'blue'});

    this.map.addLayer(this.trRoute);
  }

  /**
   * 表格行鼠标离开
   * */
  trLeave(): void {
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

  /**
   * 标志选择变化
   * */
  signChange(item: any): void {
    this.map.on('click', this.addSign);
  }

  /**
   * 移动sign marker
   * */
  editSign(layer): void {
    const id = layer._leaflet_id ? layer._leaflet_id : null;
    if (!id) {
      throw new Error(`图层id为${id}`);
      return;
    }

    this.signMarkerArray.some((item, index) => {
      if (item._leaflet_id === id) {
        item = layer;
        return true;
      }
    });
  }

  /**
   * 删除sign marker
   * */
  removeSign(layer): void {
    const id = layer._leaflet_id ? layer._leaflet_id : null;
    if (!id) {
      throw new Error(`图层id为${id}`);
      return;
    }

    this.signMarkerArray.some((item, index) => {
      if (item._leaflet_id === id) {
        this.signMarkerArray.splice(index, 1);
        return true;
      }
    });
  }

  /**
   * 添加sign marker
   * */
  addSign =  e => {
    const latlng = e.latlng;
    const icon = L.icon({
      iconUrl: this.selectedSign.iconUrl,
      iconSize: [50, 50],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76]
    });
    const signMarker = L.marker(latlng, {icon}).addTo(this.signItems);
    signMarker.type = this.selectedSign.type;
    this.signMarkerArray.push(signMarker);
    console.log(signMarker);
    this.map.off('click', this.addSign);
  }

  /**
   * 清空sign marker
   * */
  clearSign(): void {
    const layers = this.signItems.getLayers();
    if (layers.length <= 0) {
      this.commonService.info('没有可清除的sign');
      return;
    }

    this.signItems.clearLayers();
  }

  /**
   * 读取数据
   * */
  read = (): void => {
    this.drawnItems.clearLayers();
    this.signMarkerArray.forEach(item => {
      this.map.removeLayer(item);
    });
    this.signMarkerArray = [];

    const input = this.element.nativeElement.querySelector('#upload-input');
    const  file = input.files[0];
    const reader = new FileReader();
    const vm = this;
    reader.onload = function () {
      const data = JSON.parse(this.result);
      console.log(data);
      if (data.polyline) {
        const arrLatlng: Array<any> = data.polyline.geometry.coordinates;
        const start = arrLatlng[0];
        vm.startPoint = L.latLng(start[1], start[0]);
        const end = arrLatlng[arrLatlng.length - 1];
        vm.endPoint = L.latLng(end[1], end[0]);
        vm.createAndRestorePolyline(data.polyline);
      }
      if (data.marker) {
        vm.createAndAddSineMarker(data.marker, vm);
      }
    };
    reader.readAsText(file);
  }

  /**
   * 创建并添加到地图上polyline
   * */
  createAndRestorePolyline(geojson: any): void {
    console.log(geojson);
    const arrLatlng: Array<any> = geojson.geometry.coordinates.reverse();

    const latlngs = [];
    arrLatlng.forEach((item, index) => {
      latlngs.push([item[1], item[0]]);
    });
    this.drawnItems.removeLayer(this.route);
    this.route = L.polyline(latlngs, {color: 'red'});
    this.drawnItems.addLayer(this.route);

    this.createTable();
  }

  /**
   * 创建并添加到地图上marker
   * */
  createAndAddSineMarker(arr: Array<any>, context: any): void {
    arr.forEach(item => {
      const icon = L.icon({
        iconUrl: context.getSignUrl(item.properties.type),
        iconSize: [50, 50],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
      });
      const arrLatlng: Array<any> = item.geometry.coordinates;
      const latlng = L.latLng(arrLatlng[1], arrLatlng[0]);
      const signMarker = L.marker(latlng, {icon}).addTo(context.map);
      context.signMarkerArray.push(signMarker);
    });
  }

  /**
   * 获取sign对用的图片url
   * */
  getSignUrl(type: string): string {
    let url = '';
    this.SIGNS.some(item => {
      if (type === item.type) {
        url = item.iconUrl;
        return true;
      }
    });
    return url;
  }

  /**
   * 保存数据
   */
  save(): void {
    const polyline = this.route ? this.route.toGeoJSON() : null;
    console.log(polyline);

    const marker = [];
    this.signMarkerArray.forEach(item => {
      const geojson = item.toGeoJSON();
      geojson.properties.type = item.type;
      marker.push(geojson);
    });
    console.log(marker);

    const data = {polyline, marker};
    const blob = new Blob([JSON.stringify(data)], { type: '' });
    saveAs(blob, 'data.json');
  }
}

