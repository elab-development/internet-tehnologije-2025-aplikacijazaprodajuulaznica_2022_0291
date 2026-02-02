<x-mail::message>
# Resetovanje lozinke

Dobili smo zahtev za resetovanje lozinke za vaš nalog u našem Pozorištu. 
Ako niste vi poslali ovaj zahtev, slobodno ignorišite ovaj mejl.

<x-mail::button :url="$url">
Resetuj lozinku
</x-mail::button>

Ovaj link za resetovanje će isteći za 60 minuta.

Hvala,<br>
{{ config('app.name') }}
</x-mail::message>
