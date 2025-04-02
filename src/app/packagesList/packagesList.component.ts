import { Component, OnInit } from '@angular/core';
import { PackagesService } from '../packages/packages.service';
import { HttpClientModule } from '@angular/common/http';
import {Package, ChangedFormatPackage} from '../interfaces/package.interface'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { bootstrapDownload } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';


@Component({
  selector: 'app-packagesList',
  standalone: true,
  imports: [ NgIcon],
  viewProviders: [provideIcons({ bootstrapDownload })],
  templateUrl: './packagesList.component.html',
  styleUrls: ['./packagesList.component.scss']
})
export class PackagesListComponent implements OnInit {
  packages: Package[] = [];
  changedPackages: ChangedFormatPackage[] =[];
  isLoading = true;
  errorMessage: string | null = null;
  
  highlightedDeps: string[] = [];

  constructor(
    private packagesService: PackagesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.packagesService.getPackages().subscribe({
      next: (data:Package[]) => {
        // this.packages = data;
        this.changedPackages = this.changeFormat(data)
        
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Не удалось загрузить данные';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  private changeFormat(packages: Package[]): ChangedFormatPackage[] {
    return packages.map(pkg => {
      
      const formattedPkg: ChangedFormatPackage = {
        id: pkg.id,
        weeklyDownloads: this.formatDownloads(pkg.weeklyDownloads),
        dependencyCount: this.formatDependencies(pkg.dependencyCount)
      };
      return formattedPkg;
    });
  }

  private formatDownloads (downloads:number):string{
    let tmp = downloads.toString();

    if (downloads >= 1000 && downloads < 1000000) {
      tmp = `${Math.round(downloads/1000)}K`;
    } else if (downloads >= 1000000) {
      tmp = `${Math.round(downloads/1000000)}M`;
    }
    return tmp;
  }
  private formatDependencies (dependecies:number):string {
    
    return dependecies > 1 ? `${dependecies} dependencies` 
    : `${dependecies} dependency`
  }

  highlightPackageName(id: string): SafeHtml {
    if (!id.includes('/')) {
      return this.sanitizer.bypassSecurityTrustHtml(id);
    }

    const [first, second] = id.split('/');
    const highlighted = `
      <span style="color:orange;">${first}/</span><span>${second}</span>
    `;

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  onMouseEnter(pkgId: string): void {
    this.packagesService.getPackageDependencies(pkgId)
      .subscribe({
        next: (deps) => {
          this.highlightedDeps = deps;
        },
        error: (err) => {
          console.error('Ошибка загрузки зависимостей', err);
          this.highlightedDeps = [];
        }
      });
  }

  onMouseLeave(): void {
    this.highlightedDeps = [];
  }

  isHighlighted(pkgId: string): boolean {
    return this.highlightedDeps.includes(pkgId) 
  }


}