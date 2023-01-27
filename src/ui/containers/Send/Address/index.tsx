import { Dispatch, SetStateAction, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccountsSelector } from '../../../../accounts';
import { useMediaQuery } from '../../../../hooks';
import {
  AddressValidatorsType,
  routesPath,
  validateAddress,
} from '../../../../utils';
import {
  Balance,
  Button,
  CloseSvg,
  Input,
  SearchSvg,
  Select,
} from '../../../components';
import { selectBalance } from '../../../redux';

type AddressProps = {
  search: string;
  select: string;
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  setSearch: Dispatch<SetStateAction<string>>;
  setSelect: Dispatch<SetStateAction<string>>;
  setIsOpenDetailTx: Dispatch<SetStateAction<boolean>>;
};

export const Address: React.FC<AddressProps> = ({
  search,
  select,
  amount,
  setAmount,
  setSearch,
  setSelect,
  setIsOpenDetailTx,
}) => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery();
  const balance = useAccountsSelector(selectBalance);

  const [isValidate, setIsValidate] = useState<AddressValidatorsType>(
    {} as AddressValidatorsType
  );

  const handleBack = () => navigate(routesPath.HOME);

  const options = [
    {
      value: 'PNB',
      label: (
        <div className="flex flex-col">
          <p className="text_numbers">PNB</p>
          <div className="flex items-center">
            <p className="text_body text-light_grey">Balance:</p>
            <Balance className="text_numbers_s text-light_grey ml-[16px]" />
          </div>
        </div>
      ),
    },
  ];

  const handleMax = () => setAmount(String(balance));

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    const validators = validateAddress(event.target.value);
    setIsValidate((state) => ({
      ...state,
      ...validators,
    }));
    if (!event.target.value) setIsValidate({} as AddressValidatorsType);
  };

  const handleChangeSelect = (value: string) => {
    setSelect(value);
  };

  const handleChangeAmout = (event: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(event.target.value);

  const handleNext = () => setIsOpenDetailTx(true);

  return (
    <>
      <div className="w-[100%] flex justify-center items-center ext:mb-[24px] tablet:mb-[16px]">
        <p className="h1 ml-[auto]">Send to address</p>
        <span
          className="ml-[auto] svg_hover cursor-pointer"
          onClick={handleBack}
          role="button"
          tabIndex={0}
        >
          <CloseSvg
            width={isDesktop ? '24' : '16'}
            height={isDesktop ? '24' : '16'}
            fill="#E0E0E0"
          />
        </span>
      </div>
      <Input
        placeholder="Search, address..."
        value={search}
        isError={Object.values(isValidate).includes(false)}
        onChange={handleChangeSearch}
        leftSvg={
          <span className="ml-[24px] mr-[9px]">
            <SearchSvg />
          </span>
        }
        helperText="Invalid recipient address"
        className="w-[100%]"
      />
      <div className="bg-brown rounded-[15px] h-[492px] w-[100%]">
        {!Object.values(isValidate).includes(false) && search ? (
          <div className="h-[100%] flex flex-col justify-between px-[12px] pt-[30px] pb-[37px]">
            <div className="flex flex-col">
              <Select
                label="Assets:"
                options={options}
                handleChange={handleChangeSelect}
                initialValue={select}
              />
              <Input
                label={
                  <p
                    className={`${
                      isDesktop ? 'h3' : 'h2_ext'
                    }} text-light_grey`}
                  >
                    Total :
                  </p>
                }
                value={amount}
                onChange={handleChangeAmout}
                className="ext:mt-[40px] tablet:mt-[22px]"
                rightElement={
                  <div
                    className="flex items-center bg-dark_grey h-[50px] px-[25px] rounded-r-[15px] text_button_ext cursor-pointer"
                    onClick={handleMax}
                  >
                    Max
                  </div>
                }
              />
            </div>
            <div className="w-[100%] flex">
              <Button
                mode="transparent"
                onClick={handleBack}
                title="Cancel"
                className="py-[7px] w-[50%] mr-[8px]"
              />
              <Button
                mode="gradient"
                onClick={handleNext}
                title="Next"
                className="py-[7px] w-[50%] ml-[8px]"
                disabled={!amount}
              />
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
