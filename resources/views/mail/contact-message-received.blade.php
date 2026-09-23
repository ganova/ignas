<x-mail::message>
# New message from your website

**Name:** {{ $contactMessage->name }}

**Email:** {{ $contactMessage->email }}

@if ($contactMessage->whatsapp)
**WhatsApp:** {{ $contactMessage->whatsapp }}
@endif

**Message:**

{{ $contactMessage->message }}

<x-mail::button :url="'mailto:'.$contactMessage->email">
Reply by email
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
