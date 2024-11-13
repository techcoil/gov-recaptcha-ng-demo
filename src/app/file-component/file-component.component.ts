import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CaptchaServiceService } from '../captcha-service.service';

@Component({
  selector: 'app-file-component',
  standalone: true,
  imports: [],
  templateUrl: './file-component.component.html',
  styleUrl: './file-component.component.css',
})
export class FileComponentComponent implements OnInit {
  @Input()
  filename: string = '';

  public captchaReady: boolean = false;

  constructor(
    private readonly captchaService: CaptchaServiceService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.captchaService.init();
    this.captchaService.readySubject.subscribe((ready) => {
      this.captchaReady = ready;
      this.cdr.detectChanges();
    });
  }

  async downloadFile() {
    const token = await this.captchaService.generateToken();
    console.log('downloading file with token', token, this.filename);
  }
}
