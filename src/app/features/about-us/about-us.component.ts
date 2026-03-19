import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  craftsmanshipSteps = [
    {
      icon: 'draw',
      title: 'Visionary Design',
      description: 'Pencil sketches evolve into detailed 3D renderings, capturing the movement of light.'
    },
    {
      icon: 'precision_manufacturing',
      title: 'Master Casting',
      description: 'Pure 18k gold is poured into custom molds using heritage vacuum casting techniques.'
    },
    {
      icon: 'auto_fix_high',
      title: 'Hand Polishing',
      description: 'Twelve stages of manual polishing achieve the Aura signature liquid-mirror finish.'
    },
    {
      icon: 'verified',
      title: 'Certification',
      description: 'Rigorous inspection and individual hallmarking ensure lifelong quality and authenticity.'
    }
  ];

  ethics = [
    {
      title: 'Conflict-Free Diamonds',
      description: 'We strictly adhere to the Kimberley Process and beyond, ensuring every stone is traced from its origin to our workshop.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEAcdfUITGAOO9JmNINTbtukYsBvbg6D1ejd_SEQQbFpnys6JNHNveHNiRAVbxiGSXQ2flhdGkhi8rt_rHJUOzsg3ut74PaUsriEwN6uhIiX_S0Bs4WaM76UMA1_oAc8wpgiCWPX5OpkLlGe-jtbklieOAy_gTde8mLO4sfWBt6973Z_LtTke9Ym9E4LqulY3qA_8xTLQ3uWFgkueGQWx3PQVb01c3eg9Gy3u7ZU2LEFErqnre3L-2g4ikJBzwAo4Zmwdh6w8W-epP'
    },
    {
      title: 'Recycled 18K Gold',
      description: 'Our gold is 100% recycled, reducing mining waste and CO2 emissions without compromising the purity of the final piece.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf9EIeLpMeuXfLZyUAr3Eg59aQYIS9hADdBRoy5m0KL3hX6HIDRMgXU5YkVxBlrpSnLz13a7t1mg5U8_4CF8J88wnoYBzE_WVUDwN9zv_68AtnZXsLw0fzHthxMaA3pjQw77UGMtXw56AVYsRRQNxhxEFgYrL2Q9sPuFDx6eSfVPP5SsFXwhFqT50sozKU4xJnqoSQd9EleEzHthHh8t6B8s5j0TceHpxL8mZHSmxWhc_UM0hvVhI4f2u6fgNjM_5fXTiVYLKEnJMV'
    }
  ];
}
