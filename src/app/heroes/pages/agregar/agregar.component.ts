import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { Heroe, Publisher } from '../../interfaces/heroe.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
    selector: 'app-agregar',
    templateUrl: './agregar.component.html',
    styles: [
        `
        img{
            width:100%;
            max-width:800px;
            height:auto;
            border-radius:5px;
        }
        `
    ]
})
export class AgregarComponent implements OnInit {
    publishers = [
        {
            id: 'DC Comics',
            desc: 'DC - Comics'
        },
        {
            id: 'Marvel Comics',
            desc: 'Marvel - Comics'
        }
    ]

    heroe: Heroe = {
        superhero: '',
        alter_ego: '',
        characters: '',
        first_appearance: '',
        publisher: Publisher.DCComics,
        alt_img: '',
    }

    constructor(private heroesService: HeroesService,
        private activatedRoutes: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
        private dialog: MatDialog) { }

    ngOnInit(): void {
        if (!this.router.url.includes('editar')) {
            return
        }
        this.activatedRoutes.params.pipe(
            switchMap(({ id }) => this.heroesService.getHeroePorId(id))
        ).subscribe((heroe) => {
            this.heroe = heroe;
        });
    }

    guardar() {
        if (!this.heroe.superhero.trim().length) {
            this.mostrarSnackbar('Agrege un nombre')
            return
        }

        if (this.heroe.id) {
            this.heroesService.actualizarHeroe(this.heroe)
                .subscribe((heore) => this.mostrarSnackbar('Registo actualizado'));
        } else {
            //crear registro
            this.heroesService.agregarHeroe(this.heroe)
                .subscribe((heroe) => {
                    this.router.navigate(['/heroes/editar', heroe.id]);
                    this.mostrarSnackbar('Registo creado');
                });
        }
    }

    borrarHeroe() {
        const dialogo = this.dialog.open(ConfirmarComponent, {
            width: "250px",
            data: { ...this.heroe }
        });

        dialogo.afterClosed().subscribe(
            (result) => {
                if (result) {
                    this.heroesService.borrarHeroe(this.heroe.id!)
                        .subscribe((resp) => {
                            this.router.navigate(['/heroes']);
                        })
                }
            }
        );
    }

    mostrarSnackbar(mensaje: string) {
        this.snackBar.open(mensaje, "ok!", {
            duration: 2500
        })
    }
}
