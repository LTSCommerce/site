<?php
$customer = $this->customerRepository->find($id);
if (null === $customer) {
    throw new CustomerNotFoundException($id);
}

$email->setBody("Dear {$customer->getFullName()},\n\n{$body}");
