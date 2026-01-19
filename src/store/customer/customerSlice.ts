import type {
  CheckRecord,
  Classification,
  ClientState,
  Customer,
  DiscountRecord,
  Management,
  CustomerBoletas,
  CustomerCuotas,
  PatentsList,
  EmailsList,
  PhoneList,
} from '@/interfaces/customer.interfaces';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: ClientState = {
  classifications: [],
  customerInformation: [],
  customerManagement: [],
  customerBoletas: [],
  customerEmails: [],
  customerPhones: [],
  customerDiscount: [],
  customerDicom: [],
  customerPatents: [],
  customerChecks: [],
  customerCuotas: [],
};

export const customerSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    onClassifications: (state, action: PayloadAction<Classification[]>) => {
      state.classifications = action.payload;
    },
    onCustomerInformation: (state, action: PayloadAction<Customer[]>) => {
      state.customerInformation = action.payload;
    },
    onCustomerBoletas: (state, action: PayloadAction<CustomerBoletas[]>) => {
      state.customerBoletas = action.payload;
    },
    onCustomerManagement: (state, action: PayloadAction<Management[]>) => {
      state.customerManagement = action.payload;
    },
    onCustomerDiscount: (state, action: PayloadAction<DiscountRecord[]>) => {
      state.customerDiscount = action.payload;
    },
    onCustomerCuotas: (state, action: PayloadAction<CustomerCuotas[]>) => {
      state.customerCuotas = action.payload;
    },

    onCustomerPatents: (state, action: PayloadAction<PatentsList[]>) => {
      state.customerPatents = action.payload;
    },

    onCustomerChecks: (state, action: PayloadAction<CheckRecord[]>) => {
      state.customerChecks = action.payload;
    },

    onCustomerPhone: (state, action: PayloadAction<PhoneList>) => {
      state.customerPhones = action.payload;
    },

    onCustomerEmail: (state, action: PayloadAction<EmailsList>) => {
      state.customerEmails = action.payload;
    },

    onDicom: (state, { payload }) => {
      state.customerDicom = payload;
    },

  },
});

export const {
  onCustomerInformation,
  onCustomerBoletas,
  onCustomerDiscount,
  onCustomerPhone,
  onCustomerEmail,
  onCustomerManagement,
  onCustomerPatents,
  onClassifications,
  onDicom,
  onCustomerChecks,
  onCustomerCuotas,
} = customerSlice.actions;
