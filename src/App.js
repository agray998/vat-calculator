import { useState } from 'react';
import './App.css';
import DisplayBlock from './DisplayBlock';
import PriceEntryField from './PriceEntryField';
import VatRateField from './VatRateField';


function App() {
 const [netPrice, setNetPrice] = useState(0.0);
  const [grossPrice, setGrossPrice] = useState(0.0);
  const [vatToPay, setVatToPay] = useState(0.0);
  const [vatRate, setVatRate] = useState(20.0);

  const handleNetPriceChange = (price) => {
    const gross_price = (price * ((vatRate / 100) + 1)).toFixed(2);
    setNetPrice(parseFloat(price.toFixed(2)));
    setGrossPrice(parseFloat(gross_price));
    setVatToPay(parseFloat((gross_price - price).toFixed(2)));
};

  const handleGrossPriceChange = (price) => {
    const net_price = (price / ((vatRate / 100) + 1)).toFixed(2);
    setNetPrice(parseFloat(net_price));
    setGrossPrice(parseFloat(price.toFixed(2)));
    setVatToPay(parseFloat((price - net_price).toFixed(2)));
};

  const handleVatRateChanged = (rate) => {
    setVatRate(rate);
    updatePrices();
  };

  const updatePrices = () => {
    handleNetPriceChange(netPrice);
  };

  return (
    <div className='header field'>
      VAT CALC CUSTOM
      <div className='colour-border'>
        <VatRateField customstyle="field" vatRateChanged={handleVatRateChanged} value={vatRate} updatePrices={updatePrices} />
        <PriceEntryField customstyle="field" label="Price excl VAT: " priceChanged={handleNetPriceChange} price={netPrice === 0.0 ? "" : netPrice} />
        <DisplayBlock customstyle="field" label="VAT to pay: " value={vatToPay} />
        <PriceEntryField customstyle="field" label="Price incl VAT: " priceChanged={handleGrossPriceChange} price={grossPrice === 0.0 ? "" : grossPrice} />
      </div>
    </div>
  );
}

export default App;

