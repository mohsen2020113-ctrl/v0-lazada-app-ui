import { NextRequest, NextResponse } from 'next/server';

// Dashboard Admin Panel Data Structure
interface DashboardSection {
    id: string;
    title: string;
    icon: string;
    description: string;
    metrics: { label: string; value: string | number }[];
    link: string;
}

interface DashboardData {
    sections: DashboardSection[];
    stats: {
      totalSales: number;
      totalOrders: number;
      totalCustomers: number;
      activeListings: number;
    };
    recentActivity: { timestamp: string; action: string; details: string }[];
    liveChannels: { id: string; name: string; viewers: number; status: string }[];
}

const dashboardData: DashboardData = {
    sections: [
      {
              id: 'site-management',
              title: 'Site Management',
              icon: 'settings',
              description: 'Configure store settings and general settings',
              metrics: [
                { label: 'Store Status', value: 'Active' },
                { label: 'Last Updated', value: '2 hours ago' }
                      ],
              link: '/admin/site-settings'
      },
      {
              id: 'accounts',
              title: 'Accounts',
              icon: 'users',
              description: 'Manage user accounts and permissions',
              metrics: [
                { label: 'Total Users', value: 1250 },
                { label: 'Active Today', value: 324 }
                      ],
              link: '/admin/accounts'
      },
      {
              id: 'smart-commands',
              title: 'Smart Commands',
              icon: 'zap',
              description: 'AI-powered command execution',
              metrics: [
                { label: 'Commands', value: 45 },
                { label: 'Success Rate', value: '98.5%' }
                      ],
              link: '/admin/smart-commands'
      },
      {
              id: 'products',
              title: 'Products',
              icon: 'box',
              description: 'Product inventory and catalog',
        metrics: [
          { label: 'Total Products', value: 5840 },
          { label: 'Active', value: 5200 }
                ],
              link: '/admin/products'
      },
      {
              id: 'orders-returns',
              title: 'Orders & Returns',
              icon: 'shopping-bag',
              description: 'Manage orders and return requests',
              metrics: [
                { label: 'Pending Orders', value: 127 },
                { label: 'Returns', value: 8 }
                      ],
              link: '/admin/orders'
      },
      {
              id: 'customers',
              title: 'Customers & Loyalty',
              icon: 'heart',
              description: 'Customer management and loyalty programs',
              metrics: [
                { label: 'Total Customers', value: 25840 },
                { label: 'VIP Members', value: 1240 }
                      ],
              link: '/admin/customers'
      },
      {
              id: 'marketing',
              title: 'Marketing & Offers',
              icon: 'trending-up',
              description: 'Campaigns, promotions and offers',
              metrics: [
                { label: 'Active Campaigns', value: 12 },
                { label: 'Total Reach', value: '128K' }
                      ],
              link: '/admin/marketing'
      },
      {
              id: 'analytics',
              title: 'Analytics',
              icon: 'bar-chart-2',
              description: 'Sales analytics and reports',
              metrics: [
                { label: 'Daily Revenue', value: '₪15,240' },
                { label: 'Conversion Rate', value: '3.45%' }
                      ],
              link: '/admin/analytics'
      },
        {
                       id: 'translations',
                title: 'Translation & Currencies',
                icon: 'globe',
                description: 'Multi-language and currency support',
                metrics: [
                  { label: 'Languages', value: 12 },
                  { label: 'Currencies', value: 8 }
                        ],
                link: '/admin/translations'
        },
      {
              id: 'settings',
              title: 'Settings',
              icon: 'gear',
              description: 'System configuration and preferences',
              metrics: [
                { label: 'API Keys', value: 5 },
                { label: 'Webhooks', value: 8 }
                      ],
              link: '/admin/settings'
      }
        ],
    stats: {
          totalSales: 125240,
          totalOrders: 3240,
          totalCustomers: 25840,
          activeListings: 5200
    },
    recentActivity: [
      { timestamp: '2:34 PM', action: 'New Order', details: 'Order #12845 from UAE' },
      { timestamp: '2:12 PM', action: 'Product Updated', details: 'SKU-5840 price changed' },
      { timestamp: '1:45 PM', action: 'Customer Review', details: '5-star review received' },
      { timestamp: '1:20 PM', action: 'Live Stream Started', details: 'Channel: Fashion Deals' },
      { timestamp: '12:58 PM', action: 'Stock Alert', details: 'Low inventory: SKU-2840' }
        ],
    liveChannels: Array.from({ lengur: 25 }, (_, i) => ({
          id: `channel-${i + 1}`,
          name: `قناة ${String.fromCharCode(1571 + (i % 26))} - Channel ${i + 1}`,
          viewers: Math.floor(Math.random() * 50000) + 5000,
          status: i % 3 === 0 ? 'offline' : 'live'
    }))
};

export async function GET(request: NextRequest) {
    try {
          return NextResponse.json({
                  success: true,
                  data: dashboardData,
                  timestamp: new Date().toISOString()
          });
    } catch (error) {
          return NextResponse.json(
            {
                      success: false,
                      error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
                );
    }
}

export async function POST(request: NextRequest) {
    try {
          const body = await request.json();
          const { section, action, data } = body;

      // Simulate processing based on section and action
      const response = {
              success: true,
              message: `${action} executed on ${section}`,
              data: {
                        ...dashboardData,
                        lastAction: {
                                    section,
                                    action,
                                    timestamp: new Date().toISOString()
                        }
              }
      };

      return NextResponse.json(response);
    } catch (error) {
          return NextResponse.json(
            {
                      success: false,
                      error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
                );
    }
}
