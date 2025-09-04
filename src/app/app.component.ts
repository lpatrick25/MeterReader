import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
// import { BleClient } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform) {
    if (Capacitor.isNativePlatform()) {
      this.initializeApp();
      // this.initializeBLE();
    }
  }

  async initializeApp() {
    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setBackgroundColor({ color: '#2196f3' }); // Material Blue
    } catch (error) {
      console.error('StatusBar initialization failed:', error);
      await StatusBar.setBackgroundColor({ color: '#1565c0' }).catch(() => { }); // fallback
    }
  }

  // async initializeBLE() {
  //   try {
  //     await BleClient.initialize();
  //     console.log('BLE initialized');
  //   } catch (err) {
  //     console.error('BLE init failed', err);
  //   }
  // }

}
