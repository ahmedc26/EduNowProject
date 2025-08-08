import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LevelService } from '../../services/level.service';
import { Levels, LevelType } from '../../models/levels.model';
@Component({
  selector: 'app-level',
  standalone: false,
  templateUrl: './level.html',
  styleUrl: './level.css'
})
export class Level {
levels: any[] = [];


constructor( private router:Router, private levelService :LevelService){}

 ngOnInit(){
  this.loadAllLevels();
 }


 loadAllLevels() {
    this.levelService.getLevels().subscribe(
      (data) => { this.levels = data;},
      (error) =>{ console.error('Error fetching levels',error);}
    )}


    
}
