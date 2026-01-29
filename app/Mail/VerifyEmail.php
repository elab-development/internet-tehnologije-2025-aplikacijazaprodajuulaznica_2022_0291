<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $korisnik;
    public $url;

    public function __construct($korisnik, $url)
    {
        $this->korisnik = $korisnik;
        $this->url = $url;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Potvrdite vašu registraciju - Pozorište',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.verify-email',
        );
    }
}