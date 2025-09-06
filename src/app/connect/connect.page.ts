import { Component, NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Capacitor, CapacitorException } from '@capacitor/core';
import { CapacitorThermalPrinter } from 'capacitor-thermal-printer';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SearchModalComponent } from '../search-modal/search-modal.component';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.page.html',
  styleUrls: ['./connect.page.scss'],
  standalone: false,
})
export class ConnectPage {
  devices: any = [];
  isScanning = false;
  isConnected = false;

  constructor(
    private zone: NgZone,
    private toastController: ToastController,
    private router: Router,
    private modalController: ModalController
  ) {
    if (Capacitor.getPlatform() !== 'web') {
      CapacitorThermalPrinter.addListener('discoverDevices', ({ devices }: { devices: any }) => {
        this.zone.run(() => {
          this.devices = devices;
        });
      });

      CapacitorThermalPrinter.addListener('connected', async () => {
        this.zone.run(() => {
          this.isConnected = true;
        });
        const toast = await this.toastController.create({
          message: 'Connected to Water Meter!',
          duration: 1500,
          position: 'bottom',
          color: 'success',
        });
        await toast.present();
      });

      CapacitorThermalPrinter.addListener('disconnected', async () => {
        this.zone.run(() => {
          this.isConnected = false;
        });
        const toast = await this.toastController.create({
          message: 'Disconnected!',
          duration: 1500,
          position: 'bottom',
          color: 'warning',
        });
        await toast.present();
      });

      CapacitorThermalPrinter.addListener('discoveryFinish', () => {
        this.zone.run(() => {
          this.isScanning = false;
        });
      });
    }
  }

  async connectDevice(device: any) {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('Thermal printer not available on web');
      return;
    }
    await CapacitorThermalPrinter.connect({ address: device.address });
  }

  startScan() {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('Thermal printer scan not available on web');
      return;
    }
    if (this.isScanning) return;
    this.devices = [];
    CapacitorThermalPrinter.startScan().then(() => (this.isScanning = true));
  }

  stopScan() {
    if (Capacitor.getPlatform() === 'web') return;
    CapacitorThermalPrinter.stopScan();
  }

  disconnect() {
    if (Capacitor.getPlatform() === 'web') return;
    CapacitorThermalPrinter.disconnect();
  }

  async presentSearchModal() {
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      cssClass: 'search-modal',
    });
    await modal.present();
  }
}
