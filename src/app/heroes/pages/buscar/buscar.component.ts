import { Component } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Heroe } from '../../interfaces/heroe.interface';
import { HeroesService } from '../../services/heroes.service';


@Component({
    selector: 'app-buscar',
    templateUrl: './buscar.component.html',
    styles: [
    ]
})
export class BuscarComponent {
    termino: string = "";
    heroes: Heroe[] = [];

    heroeSeleccionado: Heroe | undefined;

    constructor(
        private heroesServices: HeroesService,
        private router: Router) { }


    buscando() {
        this.heroesServices.getSugerencias(this.termino.trim())
            .subscribe((heroes) => this.heroes = heroes)
    }

    ocionSeleccionada(event: MatAutocompleteSelectedEvent) {

        const heroe: Heroe = event.option.value;

        if (!heroe) {
            this.heroeSeleccionado = undefined;
            return;
        }

        this.termino = heroe.superhero;

        this.heroesServices.getHeroePorId(heroe.id!)
            .subscribe((heroe) => this.heroeSeleccionado = heroe);
    }

    irAlheroe() {
        this.router.navigate([`/heroes/${this.heroeSeleccionado?.id}`]);
    }
}
