import { Component } from '@angular/core';
import { UserForm } from "./components/user-form/user-form";
@Component({
  selector: 'app-root',
  imports: [UserForm],
  templateUrl: './app.html',
})
export class App {
  protected title = 'userform-front';
}
