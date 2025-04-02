import { Component } from '@angular/core';
import { PackagesListComponent } from './packagesList/packagesList.component';

@Component({
  selector: 'app-root',
  imports: [ PackagesListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sqg_test-task';
}
