<?php

namespace App\Mail;

use App\Models\Dtr;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DtrReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public $dtrs;
    public $employee;
    public $section;
    public $sectionChief;
    public $divisionChief;
    public $dateFrom;
    public $dateTo;
    public $totalAbsent;
    public $totalTardiness;
    public $totalUndertime;


    /**
     * Create a new message instance.
     */
    public function __construct(
        $dtrs,
        $employee,
        $sectionChief,
        $divisionChief,
        $dateFrom,
        $dateTo,
        $totalAbsent,
        $totalTardiness,
        $totalUndertime
    ) {
        $this->dtrs = $dtrs;
        $this->employee = $employee;
        $this->sectionChief = $sectionChief;
        $this->divisionChief = $divisionChief;
        $this->dateFrom = $dateFrom;
        $this->dateTo = $dateTo;
        $this->totalAbsent = $totalAbsent;
        $this->totalTardiness = $totalTardiness;
        $this->totalUndertime = $totalUndertime;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Dtr Report Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.dtr_report',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    public function build()
    {
        $pdf = Pdf::loadView('emails.dtr_report', [
            'dtrs' => $this->dtrs,
            'employee' => $this->employee,
            'sectionChief' => $this->sectionChief,
            'divisionChief' => $this->divisionChief,
            'dateFrom' => $this->dateFrom,
            'dateTo' => $this->dateTo,
            'totalAbsent' => $this->totalAbsent,
            'totalTardiness' => $this->totalTardiness,
            'totalUndertime' => $this->totalUndertime,
        ])->setPaper('legal', 'portrait');

        return $this->subject("DTR Report ({$this->dateFrom} to {$this->dateTo})")
            ->attachData($pdf->output(), "DTR_{$this->employee->employee_id}.pdf")
            ->view('emails.dtr_report', [
                'dtrs' => $this->dtrs,
                'employee' => $this->employee,
                'sectionChief' => $this->sectionChief,
                'divisionChief' => $this->divisionChief,
                'dateFrom' => $this->dateFrom,
                'dateTo' => $this->dateTo,
                'totalAbsent' => $this->totalAbsent,
                'totalTardiness' => $this->totalTardiness,
                'totalUndertime' => $this->totalUndertime,
            ]);
    }
}
