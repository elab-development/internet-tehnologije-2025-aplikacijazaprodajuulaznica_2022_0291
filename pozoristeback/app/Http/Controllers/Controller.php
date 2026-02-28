<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\SecurityScheme(
    securityScheme: "sanctum",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Unesite vaš API token koji ste dobili pri prijavi (login) ili registraciji."
)]
abstract class Controller
{
    //
}