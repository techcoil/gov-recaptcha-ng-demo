import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileComponentComponent } from './file-component/file-component.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FileComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ng-recaptcha';
}
