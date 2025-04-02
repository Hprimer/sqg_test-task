import { Component, OnInit } from '@angular/core';
import { PackagesService } from '../packages/packages.service';
import { Package, ChangedFormatPackage} from '../interfaces/package.interface'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { bootstrapDownload, bootstrapArrowRepeat } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-packagesList',
  standalone: true,
  imports: [ NgIcon, FormsModule, CommonModule],
  viewProviders: [provideIcons({ bootstrapDownload, bootstrapArrowRepeat })],
  templateUrl: './packagesList.component.html',
  styleUrls: ['./packagesList.component.scss']
})
export class PackagesListComponent implements OnInit {
  packages: Package[] = [];
  changedPackages: ChangedFormatPackage[] =[];
  filteredPackages: ChangedFormatPackage[] = [];
  isLoading = true;
  errorMessage: string | null = null;  
  highlightedDeps: string[] = [];
  searchTerm: string = '';

  constructor(
    private packagesService: PackagesService,
    private sanitizer: DomSanitizer
  ) {}

  private loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.packagesService.getPackages().subscribe({
      next: (data) => {
        this.changedPackages = this.changeFormat(data);
        this.filteredPackages = [...this.changedPackages];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Ошибка загрузки';
        this.isLoading = false;
      }
    });
  }
  
  ngOnInit(): void {
    this.loadData();
  }
  
  reloadData(): void {
    this.highlightedDeps = []; // Сброс дополнительных состояний
    this.searchTerm = ''; // Очистка поиска
    this.loadData();
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

  searchPackages(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPackages = this.changedPackages.filter(pkg => 
      pkg.id.toLowerCase().includes(term)
    );
  }

}