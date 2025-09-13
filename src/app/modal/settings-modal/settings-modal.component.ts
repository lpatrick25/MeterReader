import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent {

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onSetApiUrl() {
    this.modalCtrl.dismiss({ action: 'setApiUrl' });
  }

}
