import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageShellComponent } from './shared/ui/page-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PageShellComponent],
  template: `
    <app-page-shell>
      <router-outlet />
    </app-page-shell>
  `,
})
export class AppComponent {}
