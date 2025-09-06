import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { MeterReadingModalComponent } from '../modal/meter-reading-modal/meter-reading-modal.component';

@Component({
  selector: 'app-water-bill-reading',
  templateUrl: './water-bill-reading.page.html',
  styleUrls: ['./water-bill-reading.page.scss'],
  standalone: false,
})
export class WaterBillReadingPage {
  meterNumber: string = '';

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private toastController: ToastController
  ) {}

  async searchMeter() {
    if (!this.meterNumber) {
      await this.showToast('Please enter a meter number', 'warning');
      return;
    }

    try {
      const meterData = await this.apiService.getMeterDetails(this.meterNumber).toPromise();
      const modal = await this.modalController.create({
        component: MeterReadingModalComponent,
        componentProps: { meterData }
      });
      await modal.present();
    } catch (error) {
      console.error('Error fetching meter details:', error);
      const status = (error as any)?.status;
      const message = status === 401 ? 'Unauthorized: Please log in again' : 'Error fetching meter details';
      await this.showToast(message, 'danger');
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }
}
