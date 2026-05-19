export interface TrackingEvent {
  timestamp: string;
  location: string;
  locationAr: string;
  status: string;
  statusAr: string;
  description: string;
  descriptionAr: string;
  completed: boolean;
  isCurrent: boolean;
}

export interface TrackingInfo {
  trackingId: string;
  orderId: string;
  carrier: string;
  carrierAr: string;
  origin: string;
  originAr: string;
  destination: string;
  destinationAr: string;
  estimatedDelivery: string;
  currentStatus: string;
  currentStatusAr: string;
  progressPercent: number;
  events: TrackingEvent[];
}

export function generateMockTracking(id: string): TrackingInfo {
  const seed = id.charCodeAt(id.length - 1) % 5;

  const journeys: TrackingEvent[][] = [
    // Journey 1: Delivered
    [
      {
        timestamp: "2024-01-10T08:00:00Z",
        location: "Shenzhen, China",
        locationAr: "شنزن، الصين",
        status: "Order Confirmed",
        statusAr: "تم تأكيد الطلب",
        description: "Your order has been confirmed and is being prepared",
        descriptionAr: "تم تأكيد طلبك وجاري تجهيزه",
        completed: true,
        isCurrent: false,
      },
      {
        timestamp: "2024-01-11T14:30:00Z",
        location: "Shenzhen Warehouse",
        locationAr: "مستودع شنزن",
        status: "Picked Up",
        statusAr: "تم الاستلام",
        description: "Package picked up from supplier warehouse",
        descriptionAr: "تم استلام الطرد من مستودع المورد",
        completed: true,
        isCurrent: false,
      },
      {
        timestamp: "2024-01-12T20:00:00Z",
        location: "Shenzhen Airport",
        locationAr: "مطار شنزن",
        status: "Departed Origin",
        statusAr: "غادر مطار المنشأ",
        description: "Package departed from Shenzhen Bao'an International Airport",
        descriptionAr: "غادر الطرد من مطار شنزن باو'آن الدولي",
        completed: true,
        isCurrent: false,
      },
      {
        timestamp: "2024-01-13T06:15:00Z",
        location: "Dubai Warehouse",
        locationAr: "مستودع دبي",
        status: "Arrived at Hub",
        statusAr: "وصل إلى مستودع دبي",
        description: "Package arrived at LEE Dubai logistics hub",
        descriptionAr: "وصل الطرد إلى مركز لوجستيات LEE في دبي",
        completed: true,
        isCurrent: false,
      },
      {
        timestamp: "2024-01-13T11:30:00Z",
        location: "Dubai International Airport",
        locationAr: "مطار دبي الدولي",
        status: "Departed Hub",
        statusAr: "غادر مطار دبي",
        description: "Package dispatched from Dubai hub to destination country",
        descriptionAr: "تم إرسال الطرد من مستودع دبي إلى دولة الوجهة",
        completed: true,
        isCurrent: false,
      },
      {
        timestamp: "2024-01-14T09:00:00Z",
        location: "Destination Customs",
        locationAr: "جمارك الوجهة",
        status: "Customs Clearance",
        statusAr: "التخليص الجمركي",
        description: "Package is undergoing customs inspection",
        descriptionAr: "الطرد خاضع للتفتيش الجمركي",
        completed: true,
        isCurrent: false,
      },
      {
        timestamp: "2024-01-15T13:45:00Z",
        location: "Customer Address",
        locationAr: "عنوان العميل",
        status: "Delivered",
        statusAr: "تم التسليم",
        description: "Package successfully delivered to recipient",
        descriptionAr: "تم تسليم الطرد بنجاح إلى المستلم",
        completed: true,
        isCurrent: true,
      },
    ],
    // Journey 2: In transit - at Dubai
    [
      {
        timestamp: "2024-01-12T10:00:00Z",
        location: "Shenzhen, China",
        locationAr: "شنزن، الصين",
        status: "Order Confirmed",
        statusAr: "تم تأكيد الطلب",
        description: "Your order has been confirmed and is being prepared",
        descriptionAr: "تم تأكيد طلبك وجاري تجهيزه",
        completed: true,
        isCurrent: false,
      },
      {
        timestamp: "2024-01-13T08:00:00Z",
        location: "Shenzhen Warehouse",
        locationAr: "مستودع شنزن",
        status: "Picked Up",
        statusAr: "تم الاستلام",
        description: "Package picked up from supplier warehouse",
        descriptionAr: "تم استلام الطرد من مستودع المورد",
        completed: true,
        isCurrent: false,
      },
      {
        timestamp: "2024-01-13T22:30:00Z",
        location: "Shenzhen Airport",
        locationAr: "مطار شنزن",
        status: "Departed Origin",
        statusAr: "غادر مطار المنشأ",
        description: "Package departed from Shenzhen",
        descriptionAr: "غادر الطرد من شنزن",
        completed: true,
        isCurrent: false,
      },
      {
        timestamp: "2024-01-14T07:00:00Z",
        location: "Dubai Warehouse",
        locationAr: "مستودع دبي",
        status: "Arrived at Hub",
        statusAr: "وصل إلى مستودع دبي",
        description: "Package arrived at LEE Dubai hub — processing",
        descriptionAr: "وصل الطرد إلى مستودع LEE في دبي — قيد المعالجة",
        completed: true,
        isCurrent: true,
      },
      {
        timestamp: "",
        location: "Dubai International Airport",
        locationAr: "مطار دبي الدولي",
        status: "Pending Departure",
        statusAr: "في انتظار المغادرة",
        description: "Package will be dispatched from Dubai hub",
        descriptionAr: "سيتم إرسال الطرد من مستودع دبي",
        completed: false,
        isCurrent: false,
      },
      {
        timestamp: "",
        location: "Destination Customs",
        locationAr: "جمارك الوجهة",
        status: "Customs Clearance",
        statusAr: "التخليص الجمركي",
        description: "Pending customs inspection",
        descriptionAr: "في انتظار التفتيش الجمركي",
        completed: false,
        isCurrent: false,
      },
      {
        timestamp: "",
        location: "Customer Address",
        locationAr: "عنوان العميل",
        status: "Delivery",
        statusAr: "التسليم",
        description: "Pending delivery",
        descriptionAr: "في انتظار التسليم",
        completed: false,
        isCurrent: false,
      },
    ],
  ];

  const selectedJourney = seed < 3 ? journeys[0] : journeys[1];
  const completedCount = selectedJourney.filter((e) => e.completed).length;
  const progressPercent = Math.round(
    (completedCount / selectedJourney.length) * 100
  );

  const isDelivered = progressPercent === 100;

  return {
    trackingId: id,
    orderId: `#LEE-${Math.floor(10000 + (id.charCodeAt(0) * 137) % 90000)}`,
    carrier: "LEE Express",
    carrierAr: "LEE إكسبريس",
    origin: "Shenzhen, China",
    originAr: "شنزن، الصين",
    destination: "Dubai, UAE",
    destinationAr: "دبي، الإمارات",
    estimatedDelivery: isDelivered ? "تم التسليم" : "2024-01-17",
    currentStatus: isDelivered ? "Delivered" : "In Transit — Dubai Hub",
    currentStatusAr: isDelivered ? "تم التسليم" : "قيد الشحن — مستودع دبي",
    progressPercent,
    events: selectedJourney,
  };
}
