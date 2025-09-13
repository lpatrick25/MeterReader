import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ConnectivityService } from '../services/connectivity.service';
import { Router } from '@angular/router';
import type { PluginListenerHandle } from '@capacitor/core';
import { ApiService } from '../services/api.service';
import { ApiUrlModalComponent } from '../modal/api-url-modal/api-url-modal.component';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
  standalone: false,
})
export class LoadingPage implements OnInit, OnDestroy {
  networkStatus: boolean = false;
  loadingMessage: string = 'Checking network connectivity...';
  private networkSubscription?: PluginListenerHandle;
  public hasProceeded: boolean = false;

  constructor(
    private connectivityService: ConnectivityService,
    private toastCtrl: ToastController,
    private router: Router,
    private apiService: ApiService,
    private modalCtrl: ModalController,
  ) { }

  async ngOnInit() {
    this.checkConnection();

    this.connectivityService.startNetworkListener((status) => {
      this.networkStatus = status;
      if (status && !this.hasProceeded) {
        this.checkConnection();
      }
    }).then(listener => {
      this.networkSubscription = listener;
    });
  }

  ngOnDestroy() {
    this.networkSubscription?.remove();
  }

  async checkConnection() {
    this.networkStatus = await this.connectivityService.checkNetworkStatus();

    if (this.networkStatus) {
      this.loadingMessage = 'Connected. Checking server...';

      const apiUrl = await this.apiService.getApiUrl();
      const isServerUp = await this.connectivityService.pingServer(apiUrl + '/ping');

      if (isServerUp) {
        const isLoggedIn = await this.apiService.isLoggedIn();
        this.hasProceeded = true;
        this.router.navigate([isLoggedIn ? '/connect' : '/login']);
      } else {
        this.presentApiUrlDialog();
        this.showToast('Cannot reach the server.', 'danger');
      }
    } else {
      this.loadingMessage = 'No internet connection.';
      this.showToast('You are offline.', 'danger');
    }
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
    });
    await toast.present();
  }

  async presentApiUrlDialog() {
    const apiUrl = await this.apiService.getApiUrl();
    const storedUrl = await this.apiService.getCustomApiUrl();
    const modal = await this.modalCtrl.create({
      component: ApiUrlModalComponent,
      cssClass: 'api-url-modal',
      componentProps: {
        apiUrl: storedUrl || apiUrl,
      },
    });

    modal.onDidDismiss().then(async (result) => {
      const data = result.data;
      if (data?.apiUrl?.trim()) {
        await this.apiService.setCustomApiUrl(data.apiUrl.trim());
        this.showToast('API URL updated successfully.', 'success');
      } else {
        await this.apiService.clearCustomApiUrl();
        this.showToast('Using default API URL.', 'success');
      }

      // 🔑 Re-run the connection check after updating the URL
      this.loadingMessage = 'Rechecking server connection...';
      this.checkConnection();
    });

    await modal.present();
  }

}
