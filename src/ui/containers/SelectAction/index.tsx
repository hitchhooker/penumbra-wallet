import { useNavigate } from 'react-router-dom';
import { routesPath } from '../../../utils';
import { ActionBox, DowmloadSvg, Logo, PlusSvg } from '../../components';

export const SelectAction: React.FC<{}> = () => {
  const navigate = useNavigate();

  const handleNavigate = (link: string) => () => navigate(link);
  return (
    <div className="w-[100%] flex flex-col items-center justify-center">
      <p className="h1 mb-[40px]">First time on Penumbra?</p>
      <div className="flex w-[100%]">
        <ActionBox
          icon={<DowmloadSvg stroke="#E0E0E0" />}
          header="No, I already have a recovery passphrase"
          descriptions="Import an existing wallet using the initial recovery passphrase"
          buttonTitle="Wallet import"
          onClick={handleNavigate(routesPath.IMPORT_SEED_PHRASE)}
          className="w-[50%]"
        />
        <ActionBox
          icon={<PlusSvg />}
          header="Yes, let's set it up!"
          descriptions="This will create a new wallet and recovery passphrase"
          buttonTitle="Create a new wallet"
          onClick={handleNavigate(routesPath.CREATE_PASSWORD)}
          className="w-[50%] ml-[12px]"
        />
      </div>
    </div>
  );
};
