import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaterBillReadingPageRoutingModule } from './water-bill-reading-routing.module';

import { WaterBillReadingPage } from './water-bill-reading.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaterBillReadingPageRoutingModule
  ],
  declarations: [WaterBillReadingPage]
})
export class WaterBillReadingPageModule {}
