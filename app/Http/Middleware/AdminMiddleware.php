<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Proveravamo da li je korisnik ulogovan I da li mu je uloga 'admin'
        if (auth()->check() && auth()->user()->uloga == 'admin') {
            return $next($request);
        }

        // Ako nije admin, vrati grešku
        return response()->json(['poruka' => 'Pristup odbijen. Niste administrator.'], 403);
    }
}
