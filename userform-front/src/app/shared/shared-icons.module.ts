import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Eye, EyeOff, X } from 'lucide';

@NgModule({
  exports: [LucideAngularModule],
  imports: [
    LucideAngularModule.pick({
      Eye,
      EyeOff,
      X,
    }),
  ],
})
export class SharedIconsModule {}
