import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CapacitorThermalPrinter } from 'capacitor-thermal-printer';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-meter-reading-modal',
  templateUrl: './meter-reading-modal.component.html',
  styleUrls: ['./meter-reading-modal.component.scss'],
  standalone: true,
  imports: [FormsModule, IonicModule, CommonModule],
})
export class MeterReadingModalComponent {
  @Input() meterData: any;
  currentReading: number | null = null;
  billingResult: any = null;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;


  constructor(
    private modalController: ModalController,
    private apiService: ApiService
  ) { }

  async calculateBill() {
    this.successMessage = null;
    this.errorMessage = null;

    if (!this.currentReading || this.currentReading < this.meterData.previous_reading) {
      this.errorMessage = '⚠️ Invalid reading: must be greater than or equal to the previous reading.';
      return;
    }

    this.isLoading = true;
    try {
      const payload = {
        previous_reading: this.meterData.previous_reading,
        present_reading: this.currentReading,
        reading_date: new Date().toISOString().split('T')[0]
      };

      this.billingResult = await (await this.apiService.calculateAmountDue(payload)).toPromise();
      this.successMessage = '✅ Bill calculated successfully!';
    } catch (error) {
      console.error('Error calculating bill:', error);
      this.errorMessage = '❌ Failed to calculate bill. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }


  async printReceipt() {
    this.successMessage = null;
    this.errorMessage = null;
    if (Capacitor.getPlatform() === 'web') {
      this.errorMessage = '❌ Failed to print receipt. Only available on mobile.';
      return;
    }
    if (!this.billingResult) {
      this.errorMessage = '❌ Failed to print receipt. Please try again.';
      return;
    }

    try {
      const receiptText = `
Customer   : ${this.meterData?.concessionaire_name}
Account #  : ${this.meterData?.account_number}
Meter #    : ${this.meterData?.meter_number}
-----------------------------
Previous   : ${this.meterData?.previous_reading}
Current    : ${this.currentReading}
Consumption: ${this.billingResult?.consumption} cu.m.
Amount Due : ${this.billingResult?.amount_due.toFixed(2)} PHP
-----------------------------
Date: ${new Date().toLocaleDateString()}
    `;

      await CapacitorThermalPrinter.begin()
        // Company Header
        .align("center")
        .bold()
        .text("MacArthur Waterworks\n")
        .text("System & Services\n")
        .text("Municipality of MacArthur\n")
        .text("Tel No's: 535-0147, 332-6345\n")
        .clearFormatting()
        .text("-----------------------------\n")

        // Title
        .doubleHeight()
        .bold()
        .text("WATER BILL RECEIPT\n\n")
        .clearFormatting()

        // Details
        .align("left")
        .text(receiptText + "\n")

        // QR Code for validation
        .align("center")
        .qr(`${this.meterData?.account_number}-${Date.now()}`)

        // Footer
        .text("\nThank you for your payment!\n")
        .feedCutPaper()
        .write();

        this.successMessage = '✅ Bill printed successfully!';

    } catch (error) {
      this.errorMessage = '❌ Failed to print receipt. Please try again.';
      console.error("Error printing receipt:", error);
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
