import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';


test('renders VAT Calculator text', () => {
  render(<App />);
  const heading = screen.getByText(/VAT CALC CUSTOM/i);
  expect(heading).toBeInTheDocument();
});

test('renders VAT rate 20%', () => {
  render(<App />);
  const rate = screen.getByText(/20%/i);
  expect(rate).toBeInTheDocument();
});

test('renders VAT to pay', () => {
  render(<App />);
  const vatText = screen.getByText(/VAT to pay/i);
  expect(vatText).toBeInTheDocument();
});

test('renders empty gross value', () => {
  render(<App />);
  const inputs = screen.getAllByRole('spinbutton')
  expect(inputs[0].value).toBe('');
});

test('renders empty net value', () => {
  render(<App />);
  const inputs = screen.getAllByRole('spinbutton')
  expect(inputs[1].value).toBe('');
});



test('updates net price to 120 when gross is set to 100 and VAT is 20%', () => {
  render(<App />);

  const firstInput = screen.getAllByRole('spinbutton')[0];
  const secondInput = screen.getAllByRole('spinbutton')[1];
 
  // Change the value of the first input
  fireEvent.change(firstInput, { target: { value: '100' } });

  // Assert the value of the second input has changed to 120
  expect(secondInput.value).toBe('120');
});

test('updates net price to 115 when gross is set to 100 and VAT is 15%', () => {
  render(<App />);

  const firstInput = screen.getAllByRole('spinbutton')[0];
  const secondInput = screen.getAllByRole('spinbutton')[1];
  const vatRate = screen.getByRole('combobox');
 
  // Change the value of the first input
  fireEvent.change(firstInput, { target: { value: '100' } });

    // Change the value of the VAT rate
  fireEvent.change(vatRate, { target: { value: '15' } });

  // Assert the value of the second input has changed to 115
  expect(secondInput.value).toBe('115');
});

test('updates net price to 100 when gross is set to 100 and VAT is Exempt', () => {
  render(<App />);

  const firstInput = screen.getAllByRole('spinbutton')[0];
  const secondInput = screen.getAllByRole('spinbutton')[1];
  const vatRate = screen.getByRole('combobox');
 
  // Change the value of the first input
  fireEvent.change(firstInput, { target: { value: '100' } });

    // Change the value of the VAT rate
  fireEvent.change(vatRate, { target: { value: 'Exempt' } });

  // Assert the value of the second input has changed to 115
  expect(secondInput.value).toBe('100');
});

test('updates net price to 112.5 when gross is set to 100 and VAT is 12.5', () => {
  render(<App />);

  const firstInput = screen.getAllByRole('spinbutton')[0];
  const secondInput = screen.getAllByRole('spinbutton')[1];
  const vatRate = screen.getByRole('combobox');
 
  // Change the value of the first input
  fireEvent.change(firstInput, { target: { value: '100' } });

    // Change the value of the VAT rate
  fireEvent.change(vatRate, { target: { value: '12.5' } });

  // Assert the value of the second input has changed to 112.5
  expect(secondInput.value).toBe('112.5');
});

test('updates GROSS price to 83.33 when NET is set to 100 and VAT is 20', () => {
  render(<App />);

  const firstInput = screen.getAllByRole('spinbutton')[0];
  const secondInput = screen.getAllByRole('spinbutton')[1];
  const vatRate = screen.getByRole('combobox');
 
  // Change the value of net
  fireEvent.change(secondInput, { target: { value: '100' } });

    // Change the value of the VAT rate
  fireEvent.change(vatRate, { target: { value: '20' } });

  // Assert the value of gross
  expect(firstInput.value).toBe('83.33');
});

test('updates GROSS price to 88.89 when NET is set to 100 and VAT is 12.5', () => {
  render(<App />);

  const firstInput = screen.getAllByRole('spinbutton')[0];
  const secondInput = screen.getAllByRole('spinbutton')[1];
  const vatRate = screen.getByRole('combobox');

      // Change the value of the VAT rate
  fireEvent.change(vatRate, { target: { value: '12.5' } });
 
  // Change the value of net
  fireEvent.change(secondInput, { target: { value: '100' } });

  // Assert the value of gross
  expect(firstInput.value).toBe('88.89');
});

test('updates GROSS price to 86.96 when NET is set to 100 and VAT is 15', () => {
  render(<App />);

  const firstInput = screen.getAllByRole('spinbutton')[0];
  const secondInput = screen.getAllByRole('spinbutton')[1];
  const vatRate = screen.getByRole('combobox');
 
      // Change the value of the VAT rate
  fireEvent.change(vatRate, { target: { value: '15' } });

  // Change the value of net
  fireEvent.change(secondInput, { target: { value: '100' } });

  // Assert the value of gross
  expect(firstInput.value).toBe('86.96');
});

test('async updates GROSS price to 86.96 when NET is set to 100 and VAT is 15', async () => {
  render(<App />);

  const firstInput = screen.getAllByRole('spinbutton')[0]; // GROSS
  const secondInput = screen.getAllByRole('spinbutton')[1]; // NET
  const vatRate = screen.getByRole('combobox');

    // Change the VAT rate asynchronously
  await waitFor(() =>
    fireEvent.change(vatRate, { target: { value: '15' } })
  );

  // Change the value of NET asynchronously
  await waitFor(() =>
    fireEvent.change(secondInput, { target: { value: '100' } })
  );


  // Wait for the GROSS input to reflect the expected value
  await waitFor(() => {
    expect(firstInput.value).toBe('86.96');
  });
});

test('async updates VAT to Pay when NET is set to 100 and VAT is 20', async () => {
  render(<App />);

  const firstInput = screen.getAllByRole('spinbutton')[0]; // GROSS
  const secondInput = screen.getAllByRole('spinbutton')[1]; // NET
  const vatRate = screen.getByRole('combobox');
  const vatText = screen.getByText(/VAT to pay/i);

    // Change the VAT rate asynchronously
  await waitFor(() =>
    fireEvent.change(vatRate, { target: { value: '20' } })
  );

  // Change the value of NET asynchronously
  await waitFor(() =>
    fireEvent.change(secondInput, { target: { value: '100' } })
  );

  // Wait for the GROSS input to reflect the expected value
  // Wait for VAT to pay value to be updated
  await waitFor(() => {
    expect(firstInput.value).toBe('83.33');
    expect(vatText.innerHTML).toBe('VAT to pay:  16.67');
  });
});
