<x-mail::message>
# Dobrodošli, {{ $korisnik->korisnicko_ime }}!

Hvala vam što ste postali član našeg pozorišta. Da biste mogli da rezervišete karte, potrebno je da potvrdite svoju email adresu.

<x-mail::button :url="$url">
Potvrdi Email
</x-mail::button>

Hvala,<br>
{{ config('app.name') }}
</x-mail::message>
