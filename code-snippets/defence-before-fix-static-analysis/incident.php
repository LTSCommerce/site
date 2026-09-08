<?php
$name = $this->customerRepository->find($id)?->getFullName() ?? '';
$email->setBody("Dear {$name},\n\n{$body}");
