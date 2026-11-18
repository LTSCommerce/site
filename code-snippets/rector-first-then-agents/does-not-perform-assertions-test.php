<?php

declare(strict_types=1);

// Dummy example of Rector re-adding an attribute because it could not see a
// mock expectation configured in setUp().
final class ExampleMailerTest extends TestCase
{
    private MailerInterface&MockObject $mailer;

    protected function setUp(): void
    {
        $this->mailer = $this->createMock(MailerInterface::class);
        $this->mailer->expects(self::once())->method('send');
    }

    // Rector added this attribute. PHPUnit 13 then flagged the tests as
    // risky, and the test was rewritten.
    #[DoesNotPerformAssertions]
    public function testSendsOnce(): void
    {
        (new ExampleNotifier($this->mailer))->notify('hello');
    }
}
