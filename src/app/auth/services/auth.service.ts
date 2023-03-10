import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { map, Observable, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment.development';

import { Auth } from '../interfaces/usuario.interfaces';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl: string = environment.baseUrl;
    private _auth: Auth | undefined;

    get auth(): Auth {
        return { ...this._auth! };
    }

    constructor(private http: HttpClient) {}

    verificaAutenticacion(): Observable<boolean> {
        if (!localStorage.getItem('token')) {
            return of(false);
        }
        return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`).pipe(
            map((auth) => {
                this._auth = auth;
                return true;
            })
        );
    }

    login(): Observable<Auth> {
        return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`).pipe(
            tap((auth) => (this._auth = auth)),
            tap((auth) => localStorage.setItem('token', auth.id.toString()))
        );
    }

    logout() {
        localStorage.removeItem('token');
        this._auth = undefined;
    }
}
