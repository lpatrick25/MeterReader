import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaterBillReadingPage } from './water-bill-reading.page';

const routes: Routes = [
  {
    path: '',
    component: WaterBillReadingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaterBillReadingPageRoutingModule {}
