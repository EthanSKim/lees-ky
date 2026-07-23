import { Outlet } from 'react-router-dom';
import { getRestaurantInfo } from '../../api/public';
import { useFetchOnMount } from '../../hooks/useFetchOnMount';
import { getOpenStatus } from '../../utils/hours';
import ClosureBanner from './ClosureBanner';
import Footer from './Footer';
import Header from './Header';
import './public-shared.css';
import './PublicLayout.css';

export default function PublicLayout() {
  const { data: restaurantInfo } = useFetchOnMount(getRestaurantInfo);
  const openStatus = restaurantInfo ? getOpenStatus(restaurantInfo.hours) : null;

  return (
    <div className="public-layout">
      {restaurantInfo?.closure_active && <ClosureBanner message={restaurantInfo.closure_message} />}
      <Header openStatus={openStatus} />
      <main>
        {/* Pages get restaurantInfo + openStatus via Outlet context so they
            don't each need their own fetch. */}
        <Outlet context={{ restaurantInfo, openStatus }} />
      </main>
      <Footer restaurantInfo={restaurantInfo} />
    </div>
  );
}
