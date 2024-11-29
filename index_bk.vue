<template src="./eInvoice.html">
</template>
<script>
import PopupHieuChinhHddt from "@/modules/Payment/SelfManageEinvoice/popups/PopupHieuChinhHddt";
import VueInput from "@/modules/search/subscriber/components/form/VueInput.vue";
import api from "./api";
import apiHelper from './api.helper'
import xmlUtil from './xml.util'
import define from "./define";
import PopupHDDT from "./PopupHDDT.vue";
import PopupTraCuuHDDT from "./Popup_TraCuuHDDT.vue";
import moment from "moment";
import eventBus from "./evenbus/eventBus";
import _ from 'lodash'
import {DichVuVienThong, LoaiHinhTB, LoaiHopDong, TRANGTHAI_DONGBO} from './enums'

import {
  Sort,
  Filter,
  Resize,
  Group,
  Freeze,
  CommandColumn,
  ExcelExport,
  Edit,
  Aggregate,
  Page,
  Toolbar,
} from "@syncfusion/ej2-vue-grids";

import { L10n } from "@syncfusion/ej2-base";
import { Empty } from "element-ui";

L10n.load({
  "vi-VN": {
    grid: {
      EmptyRecord: "Không có bản ghi nào để hiển thị",
      Item: "Bản ghi",
      Items: "Bản ghi",
      FilterbarTitle: "",
    },
  },
});

export default {
  name: "eInvoice",

  data() {
    return {
      ...define,
      commands: [
        {
          buttonOption: { content: "Xóa", cssClass: "custombutton e-info" },
        },
      ],

      html: "",
      disabled_KieuDieuChinh: true,
      grid_danhsach: [],
      _ma_gd: "",
      vma_gd: "",
      vhdkh_id: 0,
      txtMaGD: "",
      ddlMauSo: 0,
      ddlKieuDieuChinh:"",
      vthaotac: 1,
      ddlKyHieu: "",
      txtSoHoaDon: "",
      txtTenKhachHang: "",
      txtDiaChi: "",
      txtHinhThucThanhToan: "",
      txtBienBanDinhKem: "",
      txtMaSoThue: "",
      txtSoDienThoai: "",
      txtEmail: "",
      txtGhiCHuHoaDon: "",
      txtTHueGTGT: "10",
      txtCongTienDV: "",
      txtTienTHueGTGT: "",
      txtTheMoRong: "",
      txtTongCongTienThanhToan: "",
      txtTienVietBangChu: "",

      txtTongTienChiuThue10: "0",
      txtTongTienChiuThue5: "0",
      txtTongTienChiuThue0: "0",
      txtTongTienThue10: "0",
      txtTongTienThue5: "0",
      txtTongTienKhongThue: "0",
      txtTongTienKhongChiuThue: "0",
      disabledTenKH: false,
      disabledDiaChi: false,
      disabledHTTT: false,
      disabledMST: false,
      disabledSDT: true,
      disabledBienBanDinhKem: false,
      disabledEmail: false,
      disabledGhiCHuHoaDon: false,
      disabledTheMoRong: false,
      disabledTienVietBangChu: false,
      disabledCongTienDV: true,
      disabledTienThueGTGT: true,
      disabledTongCongTienThanhToan: true,
      disabledTongTienKhongThue: true,
      disabledTongTienChiuKhongThue: true,
      disabledTongTienThue5: true,
      disabledTongTienThue10: true,
      disabledTongTienChiuThue0: true,
      disabledTongTienChiuThue5: true,
      disabledTongTienChiuThue10: true,

      //update thêm ngân hàng 
      cboBank: {
        value: 0,
        options: [],
      },
      txtSoTaiKhoan: "",
      visibleNganHang: false,
      visibleSoTaiKhoan: false,
      disabledNganHang: false, 
      disabledSoTaiKhoan: true,

      tt78_stk_nh: false,
      tt78: false,

      showgrid: {
        Amount: false,
        Amount_sauthue: true,
        Total: true,
        Vat: true,
        VATAmount: true,
      },

      options: {
        mauso: [],
        kieudieuchinh: [],
        thaotac: [],
        kyhieu: [],

        danhsach_grid_nhanvien: [],
        cols_ds_nv: [
          {
            fieldName: "ten_nv",
            headerText: "Account",
            allowSorting: true,
            autoFit: true,
          },
          {
            fieldName: "so_dt",
            headerText: "Account",
            allowSorting: true,
            autoFit: true,
          },
          {
            fieldName: "nhiemvu",
            headerText: "Account",
            allowSorting: true,
            autoFit: true,
          },
          {
            fieldName: "ghichu",
            headerText: "Account",
            allowSorting: true,
            autoFit: true,
          },
        ],
      },
      Tag: 1,
      tieude: "",
      noidung: "",
      flag: 0,
      count: 0,

      smtpServer: "",
      smtpUser: "",
      smtpPass: "",
      smtpPort: "",
      smtpAlias: "",

      vkhongguimail_td: 0,
      vchophep_gdv_dc_thongtin: 0,
      vchophep_gdv_dc_thongtin_hd_moi: 0,
      vkhongcho_gdv_huy_hddt_khac_thanh: 0,
      vthem_extra: false,
      vlamtron_dongia: false,
      vtt_hddt_hd: 0,
      vtt_hddt_hd_user: 0,

      ktra_quyen: 0,
      kq_capnhat: [],
      lblTenHoaDon: "",
      lblMaSoThue: "",
      lblTenDonVi: "",
      lblDiaChi: "",
      lblMaSo: "",
      lblMauSo: "",
      lblKyHieu: "",
      lblSo_No: "",
      lblThangHoaDon: "",

      quytrinh_id_2: 0,
      huonggiaotn_id: 0,
      vphieutt_id: "",
      khoa: 0,
      vnhanvien_id: 0,
      vpattern_id: 0,
      vseri_id: 0,
      vsoseri: 0,
      vfkey: "",
      Fkey: "",
      da_xuathd: false,
      t_tien_tt: 0,
      bdhddt_cha_id: 0,
      vstk: "",
      vdiachi_tt: "",
      vfax: "",
      vnguoi_dd: "",
      vloai_kh: "",
      vsodt_kh: "",
      vloaihd_id: "",
      t_tien_edited: 0,
      t_tien_load: 0,
      t_tien_thoaitra: 0,
      i_thoaitra_tmp: 0,
      tiengoc: 0,
      array_byte: [],
      BDHDDT_ID: 0,
      invToken: "",
      fkey_new: "",
      vtt: false,
      dsBDHDDT: [],
      dsBDHDDTCT: [],
      ds_thoai: [],
      objHoaDonDienTu: {},
      objHoaDonDienTuEdit: {},
      dtBienDong: [],
      dtHopDong: [],
      ds_kt: [],
      ds_tb: [],
      dsTS: [],
      _dsGoi: [],
      js_thoaitra_out: [],
      kt_tongtien: 0,
      thamso: 0,
      h_doituong_id: 0,
      handatcho: "",
      first: true,
      _thaythe: 0,
      _dieuchinh: 0,
      vpayment: "",
      kieuld_id: 0,
      vxuat_hd_nhieumucthue: false,
      dslamId: 0,
      bien_kqua: "",
      json_update: [],
      dsHDKH: [],
      dsHDTB: [],
      dsHDTBGOI: [],
      hdkh_id_huygoi_mytv: 0,
      hdtb_id_huygoi_mytv: 0,

      thaydoi_doituong_visa: 0,
      doicongacccountvisa: 0,
      doitocdoadsl: 0,
      vasc_status: 0,
      nguoi_cn_hd: null,

      newContent() {
        return {
          ArisingDate: "",
          InvoiceName: "",
          InvoicePattern: "",
          SerialNo: "",
          InvoiceNo: "",
          Kind_of_Payment: "",
          ComName: "",
          ComTaxCode: "",
          ComAddress: "",
          ComPhone: "",
          ComBankNo: "",
          CusCode: "",
          CusName: "",
          CusTaxCode: "",
          CusPhone: "",
          CusAddress: "",
          CusBankName: "",
          Total: "",
          VAT_Amount: "",
          Amount: "",
          Amount_words: "",
          Buyer: "",
          KindOfService: "",
          VAT_Rate: "",
          Discount_Rate: "",
          Discount_Amount: "",
          EmailDeliver: "",
          Extra: "",
          SignDate: "",
          Products: [],
          MaThanhToan: "",
        };
      },
      BD_HDDT_DATA() {
        return {
          THANHTOAN_LOI: 0,
          SERI_MOI: "",
          SERI_CU: "",
          LOAIHOADON_MOI: "",
          LOAIHOADON_CU: "",
          TONGTIEN: 0,
          PHIEUTT_ID: 0,
          HDKH_ID: 0,
          FILE_DINHKEM: null,
          SO_HD_CU: "",
          GHICHU: "",
          NGAY_CN: null,
          NGUOI_CN: "",
          THONGTINHD_MOI: "",
          THONGTINHD_CU: "",
          KIEU_BD: 0,
          MA_TT: "",
          BDHDDT_ID: 0,
          TIENBANGCHU: "",
          MAY_CN: "",
          TIENGOC: 0,
          SO_HD_MOI: "",
          EMAIL: "",
          HINHTHUC_TT: "",
          LOAIHOADON_MOI_ID: 0,
          NHANVIEN_ID: 0,
          DONVI_ID: 0,
          FKEY: "",
          BDHDDT_CHA_ID: 0,
          SDT: "",
          TIEN: 0,
          MST: "",
          TEN_TT: "",
          KIEU_ID: 0,
          SERI_MOI_ID: 0,
          TYLE_VAT: 0,
          TRANGTHAI: 0,
          NGUOI_TD: "",
          NGAY_TD: null,
          DIACHI_TT: "",
          VAT: 0,
        };
      },

      BD_HDDT_CT_DATA() {
        return {
          THANHTIEN: "",
          SOLUONG: "",
          DONVITINH: "",
          NOIDUNG: "",
          STT: "",
          BDHDDT_ID: "",
          DONGIA: "",
        };
      },

      Product() {
        return {
          Code: "",
          Remark: "",
          Total: 0,
          ProdName: "",
          ProdUnit: "",
          ProdQuantity: 0,
          ProdPrice: 0,
          Discount: 0,
          DiscountAmount: 0,
          VATRate: 0,
          VATAmount: 0,
          Amount: 0,
        };
      },

      ProductWithSTT() {
        return {
          STT: "",
          Code: "",
          Remark: "",
          Total: 0,
          ProdName: "",
          ProdUnit: "",
          ProdQuantity: 0,
          ProdPrice: 0,
          Discount: 0,
          DiscountAmount: 0,
          VATRate: 0,
          VATAmount: 0,
          Amount: 0,
        };
      },

      HD_KHACHHANGRow() {
        return {
          KHACHHANG_ID: "",
          MA_KH: "",
          TEN_KH: "",
          DIACHI_KH: "",
          SO_DT: "",
          SO_FAX: "",
          EMAIL: "",
          WEBSITE: "",
          NGAY_SN: "",
          SO_GT: "",
          NGAYCAP: "",
          NOICAP: "",
          GHICHU: "",
          KHLON_ID: "",

          HDKH_ID: "",
          MA_GD: "",
          MA_HD: "",
          NGUOI_DD: "",
          CHUCDANH_DD: "",
          NGAYLAP_HD: "",
          DONVI_ID: "",
          LOAIGT_ID: "",
          NHANVIEN_ID: "",
          LOAIHD_ID: "",
          BOSUNGTB_ID: "",
          MAY_CN: "",
          NGAY_CN: "",
          NGUOI_CN: "",
          IP_CN: "",
          KH_KT3: "",
          MST_KH: "",
          HOKHAU: "",
          LOAIKH_ID: "",
          NOICAP_HK: "",
          NGAY_HK: "",
          NGAY_YC: "",
          GIOITINH: "",
          DANTOC_ID: "",
          QUOCTICH_ID: "",
          NGANHNGHE_ID: "",
          DIACHI_NDD: "",
          NGAYHETHAN_GT: "",
          MST: "",
          STK: "",
          NGANHANG_ID: "",
          CTV_ID: "",
          TNC1_ID: "",
          TNC2_ID: "",
          TNC3_ID: "",
          DACTRUNG: "",
          KIEUHD_ID: "",
          HTTTHI_ID: "",
          HDKH_CHA_ID: "",
          PHANLOAIKH_ID: "",
          NHANVIENGT_ID: "",
          KENHTN_ID: "",
          MA_DUAN: "",

          PHIEUCSKH_ID: "",
          TNC4_ID: "",
          MA_KH_VNP: "",
          TEN_KH_CU: "",
          VMATT_NEO: "",
          LOAIKH_ID_VTN: "",
          LOAIKH_ID_HDDT: "",
        };
      },

      HD_THUEBAORow() {
        return {
          HDTB_ID: "",
          THUEBAO_ID: "",
          MA_TB: "",
          TEN_TB: "",
          DIACHI_TB: "",
          GHICHU: "",
          HDKH_ID: "",
          HDTT_ID: "",
          KIEULD_ID: "",
          TTHD_ID: "",
          LOAITB_ID: "",
          DOITUONG_ID: "",
          DICHVUVT_ID: "",
          DONVI_ID: "",
          NGAY_HT: "",
          MAY_CN: "",
          NGAY_CN: "",
          NGUOI_CN: "",
          IP_CN: "",
          SOLUONG: "",
          TBHD_PL: "",
          DIACHI_LD: "",
          NGAY_SN: "",
          KIEU_TB: "",
          STATUS: "",
          DONVI_DAU_ID: "",
          DONVI_CUOI_ID: "",
          MUCUOCTB_ID: "",
          MUCUOC_TB: "",
          THUEBAO_CHA_ID: "",
          QUYTRINH_ID: "",
          CHUYENMANG: "",
          TG_THUE_TU: "",
          TG_THUE_DEN: "",
          GOIKT_ID: "",
          SOTHANG_CK: "",
          NGAY_HH_TD: "",
          NHACC_CU_ID: "",
          DOITUONG_CT_ID: "",
          HTCM_ID: "",
          TRANGTHAIYC_ID: "",
        };
      },

      HDTB_GOI_DADVRow() {
        return {
          HDTB_ID: "",
          GOI_ID: "",
          NHOMTB_ID: "",
          CHUNHOM: "",
          THANG_HUONG: "",
          HTCM_ID: "",
          KIEU_YC: "",
        };
      },
    };
  },
  components: {
    PopupHDDT,
    PopupTraCuuHDDT,
    VueInput,
    PopupHieuChinhHddt,
  },
  provide: {
    grid: [
      Sort,
      Filter,
      Resize,
      Group,
      Freeze,
      CommandColumn,
      ExcelExport,
      Edit,
      Aggregate,
      Toolbar,
      Page,
      CommandColumn,
    ],
  },

  created() {
    this.objHoaDonDienTu = this.newContent();
    this.objHoaDonDienTuEdit = this.newContent();

    try {
      this.Tag = this.$route.query.tag;
      if (this.Tag == null) {
        this.Tag = 1;
      }
    } catch (e) {
      this.Tag = 1;
    }

    this.Xuat_HDDT_LOAD();

  },

  watch: {
    ddlMauSo(newval) {
      if (newval != 0) this.Change_MauSo();
    },
    vthaotac(newval) {
      this.vthaotac = newval;
      if (newval == 2) {
        this.disabled_KieuDieuChinh = false;
      } else {
        this.disabled_KieuDieuChinh = true;
      }

      this.ThaoTac_Changed();
    },
    grid_danhsach(newval) {
      this.grid_danhsach = newval;
    },
    txtTenKhachHang: function (val) {
      this.objHoaDonDienTuEdit.CusName = val;
    },
    txtDiaChi: function (val) {
      this.objHoaDonDienTuEdit.CusAddress = val;
    },
    txtMaSoThue: function (val) {
      this.objHoaDonDienTuEdit.CusTaxCode = val;
    },
    txtHinhThucThanhToan: function (val) {
      this.objHoaDonDienTuEdit.Kind_of_Payment = val;
    },
    txtEmail: function (val) {
      this.objHoaDonDienTuEdit.Email = val;
    },
    txtSoDienThoai: function (val) {
      this.objHoaDonDienTuEdit.CusPhone = val;
    },
    'cboBank.value':{
      handler: function (val) {
       if(val == 0){
        //test
        this.disabledSoTaiKhoan = true;
       }else{
        this.disabledSoTaiKhoan = false;
       }
      },
      deep: true
    },
    
  },

  methods: {
    load: function () {
      this.$refs.grid_danhsacha.ej2Instances.element.addEventListener(
        "mouseup",
        function (e) {
          var instance = this.ej2_instances[0];
          if (e.target.classList.contains("e-rowcell")) {
            if (instance.isEdit) instance.endEdit();
            let index = parseInt(e.target.getAttribute("Index"));
            instance.selectRow(index);
            instance.startEdit();
          }
        }
      );
    },
    changeKieuDieuChinh(){
      //test
      //{"DIEUCHINH_ID":3,"DIEUCHINH":"Hóa đơn điều chỉnh thông tin"}
        //clear reset tiền về 0
      if(this.ddlKieuDieuChinh == 3){
      
        let ar_dt = this.grid_danhsach
        this.grid_danhsach = []

        //ProdPrice. Total   VATAmount. Amount
        this.grid_danhsach=[].concat(ar_dt.map(x=>x.ProdName!=''?Object.assign(x,{
          ProdPrice:0,
          Total:0,
          VATAmount:0,
          Amount:0
        }):x))

        this.objHoaDonDienTuEdit.Total = 0
        this.objHoaDonDienTuEdit.VAT_Amount = 0
        this.objHoaDonDienTuEdit.Amount =0

        this.txtTongTienChiuThue0 = 0
        this.txtTongTienChiuThue5 = 0
        this.txtTongTienThue5 = 0
        this.txtTongTienChiuThue10 = 0
        this.txtTongTienThue10 = 0
        this.txtTongTienKhongChiuThue = 0
        this.txtCongTienDV = 0
        this.txtTienTHueGTGT = 0

        this.txtTongCongTienThanhToan =0

        this.txtTienVietBangChu='Không đồng'

        //them
        this.t_tien_edited = 0

      }
    },
    onActionComplete:  function (args) {
      if (args.requestType === "save") {


        let ar_dt = this.grid_danhsach;
        this.grid_danhsach = [];
        if (ar_dt[args.rowIndex].VATRate < 0 && ar_dt[args.rowIndex].VATRate != -1 && ar_dt[args.rowIndex].VATRate != -2 ) {
          ar_dt[args.rowIndex].VATRate = 0;
        }
        ar_dt[args.rowIndex].ProdQuantity = Math.abs(args.data.ProdQuantity);

        if (
          ar_dt[args.rowIndex].ProdName != args.data.ProdName ||
          ar_dt[args.rowIndex].ProdUnit != args.data.ProdUnit
        ) {
          ar_dt[args.rowIndex].ProdName = args.data.ProdName;
          ar_dt[args.rowIndex].ProdUnit = args.data.ProdUnit;
          ar_dt[args.rowIndex].ProdPrice = Math.abs(args.data.ProdPrice);
          ar_dt[args.rowIndex].VATRate = args.data.VATRate;
          ar_dt[args.rowIndex].Total = Math.abs(args.data.Total);
          if( ar_dt[args.rowIndex].VATRate <= 0)
          {
            ar_dt[args.rowIndex].VATAmount = 0
          }
          else
          {
            ar_dt[args.rowIndex].VATAmount = Math.abs(args.data.VATAmount);
          }
          ar_dt[args.rowIndex].Amount = Math.abs(args.data.Amount);
        } else {
          ar_dt[args.rowIndex].ProdName = args.data.ProdName;
          ar_dt[args.rowIndex].ProdUnit = args.data.ProdUnit;
          ar_dt[args.rowIndex].ProdPrice = Math.abs(args.data.ProdPrice);
          ar_dt[args.rowIndex].VATRate = args.data.VATRate;

          ar_dt[args.rowIndex].Total = Math.round(
            Number(ar_dt[args.rowIndex].ProdQuantity) *
              Number(ar_dt[args.rowIndex].ProdPrice),
            0
          );
          if(ar_dt[args.rowIndex].VATAmount != args.data.VATAmount)
          {
            if( ar_dt[args.rowIndex].VATRate <= 0)
            {
              ar_dt[args.rowIndex].VATAmount = 0
            }
            else
            {
              ar_dt[args.rowIndex].VATAmount = Math.abs(args.data.VATAmount);
            }
          }
          else
          {
              if( ar_dt[args.rowIndex].VATRate <= 0)
              {
                ar_dt[args.rowIndex].VATAmount = 0
              }
              else
              {
                ar_dt[args.rowIndex].VATAmount = Math.round(
                  (Number(ar_dt[args.rowIndex].Total) *
                    Number(ar_dt[args.rowIndex].VATRate)) /
                    100,
                  0
                );
              }

          }

          ar_dt[args.rowIndex].Amount =
            Number(ar_dt[args.rowIndex].Total) +
            Number(ar_dt[args.rowIndex].VATAmount);
        }

        ar_dt.push({
                STT: ar_dt.length + 1,
                Code: "",
                Remark: "",
                Total: "",
                ProdName: "",
                ProdUnit: "",
                ProdQuantity: "",
                ProdPrice: "",
                Discount: "",
                DiscountAmount: "",
                VATRate: "",
                VATAmount: "",
                Amount: "",
              });

        this.grid_danhsach = ar_dt;

        let tong_total = 0;
        let tong_vatamount = 0;
        let vat0 = 0;
        let vat5 = 0;
        let tien5 = 0;
        let vat10 = 0;
        let tien10 = 0;
        let tien_khong_thue = 0;
        let vat_khong_thue = 0;
        for (var i = 0; i < this.grid_danhsach.length; i++) {
          if(this.grid_danhsach[i].Code == -1){
            tong_total = tong_total + Number(this.grid_danhsach[i].Total) * -1
            tong_vatamount = tong_vatamount + Number(this.grid_danhsach[i].VATAmount) * -1
          }else{
            tong_total = tong_total + Number(this.grid_danhsach[i].Total)
            tong_vatamount = tong_vatamount + Number(this.grid_danhsach[i].VATAmount)
          }
          if (this.grid_danhsach[i].VATRate == 0) {
            vat0 = vat0 + Number(this.grid_danhsach[i].Total);
          }
          if (this.grid_danhsach[i].VATRate == 5) {
            tien5 = tien5 + Number(this.grid_danhsach[i].Total);
            vat5 = vat5 + Number(this.grid_danhsach[i].VATAmount);
          }
          if (this.grid_danhsach[i].VATRate == 10) {
            tien10 = tien10 + Number(this.grid_danhsach[i].Total);
            vat10 = vat10 + Number(this.grid_danhsach[i].VATAmount);
          }
          if (this.grid_danhsach[i].VATRate == -1){
              tien_khong_thue = tien_khong_thue + Number(this.grid_danhsach[i].Total);
          }
        }
        this.objHoaDonDienTuEdit.Total = Number(tong_total);
        this.objHoaDonDienTuEdit.VAT_Amount = Number(tong_vatamount);
        this.objHoaDonDienTuEdit.Amount =
          Number(tong_total) + Number(tong_vatamount);

        this.txtTongTienChiuThue0 = vat0;
        this.txtTongTienChiuThue5 = tien5;
        this.txtTongTienThue5 = vat5;
        this.txtTongTienChiuThue10 = tien10;
        this.txtTongTienThue10 = vat10;
        this.txtTongTienKhongChiuThue = tien_khong_thue
        this.txtCongTienDV = Number(this.objHoaDonDienTuEdit.Total);
        this.txtTienTHueGTGT = Number(this.objHoaDonDienTuEdit.VAT_Amount);

        this.txtTongCongTienThanhToan =
          Number(this.objHoaDonDienTuEdit.Total) +
          Number(this.objHoaDonDienTuEdit.VAT_Amount);

        if (this.objHoaDonDienTuEdit.Total == 0) {
          this.txtCongTienDV = 0;
          this.txtTienTHueGTGT = 0;
          this.txtTongCongTienThanhToan = 0;
          this.objHoaDonDienTuEdit.Amount = 0;
        }

        this.doi_so_sang_chu(this.txtTongCongTienThanhToan);
        this.t_tien_edited = Number(this.objHoaDonDienTuEdit.Amount);
      }
    },

    HienThi_GiaoDien_TT78() {
      this.showgrid.Amount = false;
      this.showgrid.Amount_sauthue = true;
      this.showgrid.Total = true;
      this.showgrid.Vat = true;
      this.showgrid.VATAmount = true;
      this.visibleNganHang = false;
      this.visibleSoTaiKhoan = false;
      
      // console.log("tt78_stk_nh:", this.tt78_stk_nh)
      if(this.tt78_stk_nh){
        this.visibleNganHang = true;
        this.visibleSoTaiKhoan = true;
      }
    },

    //đồng bộ test
    async get_app_config() {
      const res = await api.get_app_config(this.axios, { keyname: "DONGBO_TEST"});
      let kq = res.data.data ? res.data.data : [];
      return kq;
    },


    async Xuat_HDDT_LOAD() {
      // Khi vừa mở chức năng, con trỏ nhập liệu chưa tự động focus vào control Mã giao dịch
      this.$nextTick(() => { this.$refs["maGDRef"].focus()});

      let json = {
        nhanvien_id: this.$root.token.getNhanVienID(),
        tag_form: this.Tag,
        nguoidung_id: this.$root.token.getNguoiDungID(),
      };


      const res = await api.Xuat_HDDT_LOAD(this.axios, { ds_para:JSON.stringify(json)});

      const danhsach = res.data.data ? res.data.data : [];
     
      //set dữ liệu cho cac combo 
      this.setDataFromApiXuatHDDTLoad(JSON.parse(danhsach.js_returnds))

      //lay thongtin mail server
      this.handleGetInfoMailServer(JSON.parse(danhsach.js_returnds))

      this.txtMaGD = this._ma_gd;
      // let tsmd = JSON.parse(danhsach.js_returnds).DS_THAMSO_MD;
      this.handle_DS_THAMSO_MD(JSON.parse(danhsach.js_returnds))

      this.handleTagForm(this.Tag)

    },

    handleGetInfoMailServer(js_returnds){
      this.button.sendmail = false;
      if(!this.tieude || !this.noidung) return;
      
      if (js_returnds.DS_MAIL_SERVER.length == 0  ) return;

      const DS_MAIL_SERVER = js_returnds.DS_MAIL_SERVER[0];

      this.smtpServer = DS_MAIL_SERVER.SERVER;
      this.smtpUser = DS_MAIL_SERVER.USERNAME;
      this.smtpPass = DS_MAIL_SERVER.PASSWORD;
      this.smtpPort = DS_MAIL_SERVER.PORT;
      this.smtpAlias = DS_MAIL_SERVER.ALIAS;
      if (this.smtpServer&& this.smtpUser &&this.smtpPass &&this.smtpPort && this.smtpAlias) {
        this.button.sendmail = true;
      }
      if (DS_MAIL_SERVER.FLAG != null) {
        this.flag = Number(DS_MAIL_SERVER.FLAG);
      }
    },

    handle_DS_THAMSO_MD(js_returnds){

      let tsmd = js_returnds.DS_THAMSO_MD;

      if(!Array.isArray(tsmd)|| tsmd.length == 0 ) return;

      // KHONG_GUIMAIL_HDDT_TUDONG
      const KHONG_GUIMAIL_HDDT_TUDONG = tsmd.find(e => e.MA_TS == "KHONG_GUIMAIL_HDDT_TUDONG" && e.TEN_TS == 1);
      if(KHONG_GUIMAIL_HDDT_TUDONG)  this.vkhongguimail_td = 1;


      //CHOPHEP_GDV_DIEUCHINH_THONGTIN
      const CHOPHEP_GDV_DIEUCHINH_THONGTIN = tsmd.find(e => e.MA_TS == "CHOPHEP_GDV_DIEUCHINH_THONGTIN" && e.TEN_TS == 1);
      if(CHOPHEP_GDV_DIEUCHINH_THONGTIN)  this.vchophep_gdv_dc_thongtin = 1;
        

      //CHOPHEP_GDV_DIEUCHINH_THONGTIN_HD_MOI
      const CHOPHEP_GDV_DIEUCHINH_THONGTIN_HD_MOI = tsmd.find(e => e.MA_TS == "CHOPHEP_GDV_DIEUCHINH_THONGTIN_HD_MOI" && e.TEN_TS == 1);
      if(CHOPHEP_GDV_DIEUCHINH_THONGTIN_HD_MOI)  this.vchophep_gdv_dc_thongtin_hd_moi = 1;


      //KHONG_CHO_GDV_HUY_HDDT_KHAC_THANG
      const KHONG_CHO_GDV_HUY_HDDT_KHAC_THANG = tsmd.find(e => e.MA_TS == "KHONG_CHO_GDV_HUY_HDDT_KHAC_THANG" && e.TEN_TS == 1);
      if(KHONG_CHO_GDV_HUY_HDDT_KHAC_THANG)  this.vkhongcho_gdv_huy_hddt_khac_thanh = 1;
        

      //KHONG_CHO_GDV_HUY_HDDT_KHAC_THANG
      const THEM_HDDT_EXTRA = tsmd.find(e => e.MA_TS == "THEM_HDDT_EXTRA" && e.TEN_TS == 1);
      if(THEM_HDDT_EXTRA)  this.vthem_extra = 1;
        

      //LAM_TRON_DON_GIA
      const LAM_TRON_DON_GIA = tsmd.find(e => e.MA_TS == "LAM_TRON_DON_GIA");
      if(LAM_TRON_DON_GIA)  this.vlamtron_dongia = true;
        

      //VTT_HDDT_HOPDONG
      const VTT_HDDT_HOPDONG = tsmd.find(e => e.MA_TS == "VTT_HDDT_HOPDONG");
      if(VTT_HDDT_HOPDONG)  {
        this.vtt_hddt_hd = true;
        let tsnd = js_returnds.DS_THAMSO_NGUOIDUNG;
        const vtt_tsnd = tsnd.find(e => e.MA_TS == "VTT_HDDT_HOPDONG");
        if(vtt_tsnd) this.vtt_hddt_hd_user = Number(vtt_tsnd.GIATRI);

      }

      //HDDT_THONGTU_78
      const HDDT_THONGTU_78 = tsmd.find(e => e.MA_TS == "HDDT_THONGTU_78" && e.TEN_TS == 1);
      if(HDDT_THONGTU_78)  this.tt78 = true;  
      
      //HDDT_THONGTU_78_STK_NH
      const HDDT_THONGTU_78_STK_NH = tsmd.find(e => e.MA_TS == "HDDT_THONGTU_78_STK_NH" && e.TEN_TS == 1);
      if(HDDT_THONGTU_78_STK_NH)  this.tt78_stk_nh = true;  

      this.HienThi_GiaoDien_TT78();
      

    },

    handleTagForm(tag){
      if (tag == 1) {
        if (this.vchophep_gdv_dc_thongtin == 1) {
          (this.disabledTenKH = false),
            (this.disabledDiaChi = false),
            (this.disabledHTTT = false),
            (this.disabledMST = false),
            (this.disabledSDT = false);
        } else {
          (this.disabledTenKH = true),
            (this.disabledDiaChi = true),
            (this.disabledHTTT = true),
            (this.disabledMST = true),
            (this.disabledSDT = true);
        }

        this.button.khoaphieu = false;
      } else if (tag== 2 || tag == 3) {
        (this.disabledCongTienDV = false),
          (this.disabledTienThueGTGT = false),
          (this.disabledTongCongTienThanhToan = false);
        this.button.khoaphieu = true;
      }
    },

    async api_HienThiTT() {
      let json = {
        ma_gd: this.txtMaGD?.trim(),
        mucthue: this.txtTHueGTGT,
        nhanvien_id: this.$root.token.getNhanVienID()
      };
      const res = await api.HienThiThongTin(this.axios, {
        ds_para: JSON.stringify(json),
      });

      let dsach = res.data.data ? res.data.data : [];
      let danhsach = JSON.parse(dsach.js_returnds);
      return danhsach;
    },

    async HienThiThongTin() {
      try {
        this.Clean();
        this.ds_thoai = [];
        this.i_thoaitra_tmp = 0;
        this.objHoaDonDienTu = this.newContent();
        this.objHoaDonDienTuEdit = this.newContent();
        let tongtien = 0;
        let tien = 0;
        let vat = 0;
        let tien0 = 0;
        let tien5 = 0;
        let vat5 = 0;
        let tien10 = 0;
        let vat10 = 0;
        let tien_novat = 0;
        let tien_novat_c = 0;


        this.vma_gd = this.txtMaGD;

        let danhsach = await this.api_HienThiTT();
 

        let ds_kh = danhsach.DS_KH;

        let ds_dbkh = danhsach.DS_DBKH;
   
        if(ds_kh.length == 0){
          this.$toast.error("Không tìm thấy thông tin khách hàng!");
          this.button.capnhat = true;
          this.Clean();
          return;
        }
        
        
        this.vnhanvien_id = 0;
        this.vpattern_id = 0;
        this.vseri_id = 0;
        this.vsoseri = 0;
        this.vfkey = "";
        this.Fkey = "";
        this.da_xuathd = false;
        this.vphieutt_id = ds_kh[0].PHIEUTT_ID;

        this.vhdkh_id = ds_kh[0].HDKH_ID;
        this.khoa = danhsach.KHOA;
        if (ds_kh[0].NHANVIEN_HD_ID != null) {
          this.vnhanvien_id = ds_kh[0].NHANVIEN_HD_ID;
        }

        if (ds_kh[0].KIEU == "1") {
          this.$toast.error( "Hợp đồng đã xuất hóa đơn giấy. Bạn không được thực hiện thao tác HĐĐT!");
          return;
        }


        this.t_tien_tt = 0;
        this.ds_tb = danhsach.DS_HOPDONG_TB_HDDT;

        this.ds_thoai = danhsach.DS_THOAI;
     
        if (!this.vxuat_hd_nhieumucthue && ds_kh[0].HDDT_FKEY != null) {
          danhsach = await this.api_HienThiTT();
          // console.log('danhsach2', danhsach)
          try {
            let ds_bd_cha = danhsach.DS_BDHDDT_ID;
            if (danhsach.DS_BDHDDT_ID.length > 0) {
              this.bdhddt_cha_id = ds_bd_cha[0].BDHDDT_CHA_ID;
            } else {
              this.bdhddt_cha_id = 0;
            }
          } catch (e) {
            this.bdhddt_cha_id = 0;
          }

          this.da_xuathd = true;
          let fromDate = "";
          let toDate = "";
          // let kq = ""

          let kq =  (this.vtt_hddt_hd_user == 1) ? await this.listInvByCus_VTT(this.txtMaGD, fromDate,toDate) :  await this.listInvByCus_TT78(this.txtMaGD, fromDate,toDate)
          if (kq?.substring(0, 3) == "ERR") {
            this.$toast.error(kq);
            return;
          } else {
            if (kq == null) {
              this.$toast.error("Không tìm thấy thông tin hóa đơn!");
              return;
            } else {
              let objKetQua = xmlUtil.ObjectToXML(kq);
              if (objKetQua.getElementsByTagName("Item").length > 0) {
                //dòng 449 code cũ
                this.vtt = false;
                if (this.vtt_hddt_hd_user == 1)   this.vtt = true;
                
                eventBus.$emit("my-event");
                await this.$refs.popup_TraCuuHDDT.showModal();
              } else {
                this.$toast.error("Không tìm thấy thông tin hóa đơn!");
                return;
              }
            }
          }
        } else {
          if ( this.vchophep_gdv_dc_thongtin == 1 && this.vchophep_gdv_dc_thongtin_hd_moi == 1) {
            this.disabledTenKH = false;
            this.disabledDiaChi = false;
            this.disabledHTTT = false;
            this.disabledMST = false;
            this.disabledSDT = false;
          } else {
            this.disabledTenKH = true;
            this.disabledDiaChi = true;
            this.disabledHTTT = true;
            this.disabledMST = true;
            this.disabledSDT = true;
          }
        }
        

        this.lblMaSo = ds_kh[0].MA_KH;

        let ds_hdtt = danhsach.DS_HDTT;

   
        if (ds_hdtt.length > 0) {
          this.vstk = ds_hdtt[0].STK;
          this.txtMaSoThue = ds_hdtt[0].MST;
          this.txtTenKhachHang = ds_hdtt[0].TEN_TT;
          this.txtDiaChi = ds_hdtt[0].DIACHI_CT;
        }
        

        this.txtHinhThucThanhToan = "Tiền mặt/Chuyển khoản";
        let db = false;
        if (ds_kh[0].KHACHHANG_ID != null) {
          if (danhsach.DS_DBKH.length > 0) {
            db = true;
          }
        }

        this.vdiachi_tt = "";
        if (ds_kh[0].DIACHI_KH != null) {
          this.vdiachi_tt = ds_kh[0].DIACHI_KH;
        } else {
          if (db == true) {
            this.vdiachi_tt = ds_dbkh[0].DIACHI_KH;
          }
        }

        this.txtEmail = "";
        if (ds_kh[0].EMAIL_TT != null) {
          this.txtEmail = ds_kh[0].EMAIL_TT || "";
        } else {
          if (db == true) {
            this.txtEmail = ds_dbkh[0].EMAIL_TT || "";
          }
        }

        this.vfax = "";
        if (ds_kh[0].SO_FAX != null) {
          this.vfax = ds_kh[0].SO_FAX;
        } else {
          if (db == true) {
            this.vfax = ds_dbkh[0].SO_FAX;
          }
        }

        this.vnguoi_dd = "";
        if (ds_kh[0].NGUOI_DD != null) {
          this.vnguoi_dd = ds_kh[0].NGUOI_DD;
        } else {
          if (db == true) {
            this.vnguoi_dd = ds_dbkh[0].NGUOI_DD;
          }
        }

        this.vloai_kh = "";
        if (ds_kh[0].LOAIKH_ID != null) {
          this.vloai_kh = ds_kh[0].LOAIKH_ID;
        } else {
          if (db == true) {
            this.vloai_kh = ds_dbkh[0].LOAIKH_ID;
          }
        }

        this.vsodt_kh = "";
        if (ds_kh[0].SO_DT != null) {
          this.vsodt_kh = ds_kh[0].SO_DT;
        } else {
          if (db == true) {
            this.vsodt_kh = ds_dbkh[0].SO_DT;
          }
        }
        
        //update fix lỗi sdt 06/05/2024
        this.txtSoDienThoai = "";
        if (ds_kh[0].SO_DT != null) this.txtSoDienThoai = ds_kh[0].SO_DT || "";
        else 
          if (db == true) this.txtSoDienThoai = ds_dbkh[0].SO_DT || "";

        if (ds_kh[0].LOAIHD_ID == 1) {
          this.vloaihd_id = "0" + ds_kh[0].LOAIHD_ID;
        } else if (ds_kh[0].LOAIHD_ID == 2) {
          this.vloaihd_id = ds_kh[0].LOAIHD_ID;
        } else {
          this.vloaihd_id = "00";
        }

        this.txtSoTaiKhoan = ds_kh[0]?.STK_TT || ds_dbkh[0]?.STK_TT || ""
        this.cboBank.value = ds_kh[0]?.NGANHANG_ID_TT ||  ds_dbkh[0]?.NGANHANG_ID_TT || 0
        
        let ar_pro = [];
        let product = this.ProductWithSTT();
        
        if (this.ds_tb.length > 0) {
          for (var i = 0; i < this.ds_tb.length + 3; i++) {
            if (this.ds_tb.length <= i) {
              ar_pro.push({
                STT: i + 1,
                Code: "",
                Remark: "",
                Total: "",
                ProdName: "",
                ProdUnit: "",
                ProdQuantity: "",
                ProdPrice: "",
                Discount: "",
                DiscountAmount: "",
                VATRate: "",
                VATAmount: "",
                Amount: "",
              });
            } else {
              product.STT = i + 1;
              product.Amount = Math.abs(this.ds_tb[i].AMOUNT);
              product.ProdName = this.ds_tb[i].PRODNAME;
              product.ProdUnit = this.ds_tb[i].PRODUNIT;
              product.ProdQuantity = Math.abs(this.ds_tb[i].PRODQUANTITY);
              product.ProdPrice = Math.abs(this.ds_tb[i].PRODPRICE);

              tien = Number(tien) + Number(this.ds_tb[i].TIEN);
              vat = Number(vat) + Number(this.ds_tb[i].VAT);
              tongtien = Number(tongtien) + Number(this.ds_tb[i].TONGTIEN);

              if (this.ds_tb[i].TYLE_VAT == 0)
                tien0 = Number(tien0) + Number(this.ds_tb[i].TIEN);
              if (this.ds_tb[i].TYLE_VAT == 5) {
                tien5 = Number(tien5) + Number(this.ds_tb[i].TIEN);
                vat5 = Number(vat5) + Number(this.ds_tb[i].VAT);
              }
              if (this.ds_tb[i].TYLE_VAT == 10) {
                tien10 = Number(tien10) + Number(this.ds_tb[i].TIEN);
                vat10 = Number(vat10) + Number(this.ds_tb[i].VAT);
              }
              if (this.ds_tb[i].TYLE_VAT == -2) {
                tien_novat = Number(tien_novat) + Number(this.ds_tb[i].TIEN);
              }
              if (this.ds_tb[i].TYLE_VAT == -1) {
                tien_novat_c =
                  Number(tien_novat_c) + Number(this.ds_tb[i].TIEN);
              }
              product.Total = Math.abs(this.ds_tb[i].TOTAL);
              product.VATAmount = Math.abs(this.ds_tb[i].VATAMOUNT);
              product.VATRate = this.ds_tb[i].VATRATE;
              this.txtTHueGTGT = this.ds_tb[i].VATRATE;
              if(Number(this.ds_tb[i].TIEN) < 0)
              {
                product.Code = -1
              }
              else
              {
                product.Code=""
              }
              ar_pro.push({
                STT: product.STT,
                Code: product.Code,
                Remark: product.Remark,
                Total: product.Total,
                ProdName: product.ProdName,
                ProdUnit: product.ProdUnit,
                ProdQuantity: product.ProdQuantity,
                ProdPrice: product.ProdPrice,
                Discount: product.Discount,
                DiscountAmount: product.DiscountAmount,
                VATRate: product.VATRate,
                VATAmount: product.VATAmount,
                Amount: product.Amount,
              });
            }
          }
          this.grid_danhsach = ar_pro;

        }

        this.txtCongTienDV = Number(tien);
        this.txtTienTHueGTGT = Number(vat);
        this.txtTongCongTienThanhToan = Number(tongtien);

        this.txtTongTienChiuThue0 = Number(tien0);
        this.txtTongTienChiuThue5 = Number(tien5);
        this.txtTongTienThue5 = Number(vat5);
        this.txtTongTienChiuThue10 = Number(tien10);
        this.txtTongTienThue10 = Number(vat10);
        this.txtTongTienKhongThue = Number(tien_novat);
        this.txtTongTienKhongChiuThue = Number(tien_novat_c);
        
        //Thay đổi mẫu hóa đơn
        try {
          let pattern1 = true;
          if (this.ds_tb.length > 1) {
            let vatrate = this.ds_tb[0].VATRATE;
            for (var i = 1; i < this.ds_tb.length; i++) {
              if (this.ds_tb[i].PRODNAME != "" &&this.ds_tb[i].PRODNAME != null && vatrate != this.ds_tb[i].VATRATE) {
                pattern1 = false;
                break;
              }
            }
          }

          if (pattern1) this.ddlMauSo = this.options.mauso[0]?.id;
          else this.ddlMauSo = this.options.mauso[1]?.id;

        } catch (err) {
          console.log(err)
        }

        this.t_tien_load = tongtien;
        this.t_tien_edited = tongtien;

        await this.doi_so_sang_chu(tongtien);

        this.button.nhapmoi = false;
        this.button.capnhat = true;
      } catch (err) {
        console.log(err)
      }
    },

    async handleHienThiThongTin_DS_KH(ds_kh){
        //doing 
    },

    async accep_TraCuutHDDT(item) {   

      let tien = 0;
      let vat = 0;
      let tongtien = 0;
      this.t_tien_thoaitra = 0;
      let tien0 = 0;
      let tien5 = 0;
      let vat5 = 0;
      let tien10 = 0;
      let vat10 = 0;
      let tien_novat = 0;
      let tien_novat_c = 0;

      if (item.vchapnhan == true) {
        this.ddlKieuDieuChinh = 0; //reset kieu điều chỉnh
        this._dieuchinh = item.vdieuchinh;
        this._thaythe = item.vthaythe;
        this.vpayment = item.vpayment;
        this.Fkey = item._fkey;
        await this.TraCuu(item._pattern, item._seri, item._so_hd);


        for (var i = 0; i < this.ds_tb.length; i++) {
          this.t_tien_tt = Number(this.t_tien_tt) + Number(this.ds_tb[i].TONGTIEN);
        }


        this.t_tien_thoaitra = 0;
 
        if (this.ds_thoai.length > 0) {
          this.i_thoaitra_tmp = 1;

          let ar_pro = [];
          let product = this.ProductWithSTT();
          let stt = 1;
          for (var i = 0; i < this.ds_thoai.length + 3; i++) {
            if (this.ds_thoai.length <= i) {
              product.STT = Number(stt) + Number(i);
              ar_pro.push({
                STT: product.STT,
                Code: "",
                Remark: "",
                Total: "",
                ProdName: "",
                ProdUnit: "",
                ProdQuantity: "",
                ProdPrice: "",
                Discount: "",
                DiscountAmount: "",
                VATRate: "",
                VATAmount: "",
                Amount: "",
              });
            } else {
              product.STT = Number(stt) + Number(i);
              product.Amount = Math.abs(this.ds_thoai[i].AMOUNT);
              product.ProdName = this.ds_thoai[i].PRODNAME;
              product.ProdUnit = this.ds_thoai[i].PRODUNIT;
              product.ProdQuantity = Math.abs(this.ds_thoai[i].PRODQUANTITY);
              product.ProdPrice = Math.abs(this.ds_thoai[i].PRODPRICE);

              tien = Number(tien) + Number(this.ds_thoai[i].TIEN);
              vat = Number(vat) + Number(this.ds_thoai[i].VAT);
              tongtien = Number(tongtien) + Number(this.ds_thoai[i].TONGTIEN);

              product.Total = Math.abs(this.ds_thoai[i].TOTAL);

              this.t_tien_thoaitra = Number(this.t_tien_thoaitra) +  Number(this.ds_thoai[i].TONGTIEN);

              if (this.ds_thoai[i].TYLE_VAT == "0") {
                tien0 += this.ds_thoai[i].TIEN;
              }
              if (this.ds_thoai[i].TYLE_VAT == "5") {
                tien5 += this.ds_thoai[i].TIEN;
                vat5 += this.ds_thoai[i].VAT;
              }
              if (this.ds_thoai[i].TYLE_VAT == "10") {
                tien10 += this.ds_thoai[i].TIEN;
                vat10 += this.ds_thoai[i].VAT;
              }
              if (this.ds_thoai[i].TYLE_VAT == "-2") {
                tien_novat += this.ds_thoai[i].TIEN;
              }
              if (this.ds_thoai[i].TYLE_VAT == "-1") {
                tien_novat_c += this.ds_thoai[i].TIEN;
              }
              this.txtTHueGTGT = this.ds_thoai[i].TYLE_VAT;
              product.VATAmount = Math.abs(this.ds_thoai[i].VATAMOUNT);
              product.VATRate = this.ds_thoai[i].VATRATE;

              if(Number(this.ds_thoai[i].TIEN) < 0)
              {
                product.Code = -1
              }
              else
              {
                product.Code = ""
              }
              ar_pro.push({
                STT: product.STT,
                Code: product.Code,
                Remark: product.Remark,
                Total: Math.abs(product.Total),
                ProdName: product.ProdName,
                ProdUnit: product.ProdUnit,
                ProdQuantity: Math.abs(product.ProdQuantity),
                ProdPrice: Math.abs(product.ProdPrice),
                Discount: Math.abs(product.Discount),
                DiscountAmount: Math.abs(product.DiscountAmount),
                VATRate: product.VATRate,
                VATAmount: Math.abs(product.VATAmount),
                Amount: Math.abs(product.Amount),
              });
            }
          }

          this.grid_danhsach = ar_pro;

          this.txtCongTienDV = Math.abs(Number(tien));
          this.txtTienTHueGTGT = Math.abs(Number(vat));
          this.txtTongCongTienThanhToan = Math.abs(Number(tongtien));

          this.txtTongTienChiuThue0 = Math.abs(Number(tien0));
          this.txtTongTienChiuThue5 = Math.abs(Number(tien5));
          this.txtTongTienThue5 = Math.abs(Number(vat5));
          this.txtTongTienChiuThue10 = Math.abs(Number(tien10));
          this.txtTongTienThue10 = Math.abs(Number(vat10));
          this.txtTongTienKhongThue = Math.abs(Number(tien_novat));
          this.txtTongTienKhongChiuThue = Math.abs(Number(tien_novat_c));

          this.t_tien_load = Number(tongtien);
          this.t_tien_edited = Number(tongtien);

          await this.doi_so_sang_chu(Number(tongtien));
        
          this.button.capnhat = true;
          return;
        }
      
      } else {
        this.button.capnhat = false;
        return;
      }
    },

    async TraCuu(_Pattern, _Seri, _sohoadon) {
      this.first = true;
      this.txtBienBanDinhKem = "";
      this.txtGhiCHuHoaDon = "";
      try {
        if (_Pattern != "" && _Seri != "" && _sohoadon != "") {
          this.invToken = _Pattern + ";" + _Seri + ";" + _sohoadon;
        } else {
          if (this.ddlMauSo == 0) {
            this.ddlMauSo.Focus();
            return false;
          }
          if (this.ddlKyHieu == 0) {
            this.ddlKyHieu.Focus();
            return false;
          }
          if (this.txtSoHoaDon == "") {
            this.txtSoHoaDon.Focus();
            return false;
          }
          this.invToken =
            this.ddlMauSo + ";" + this.ddlKyHieu + ";" + this.txtSoHoaDon;
        }

        const xml = await this.downloadInvNoPay(this.invToken) || "";
 
        if (xml.substring(0, 4) == "ERR:") {
          return false;
        } else {
          try {
            const hdon = xmlUtil.ObjectToXML(xml);
            const hdon2 = xmlUtil.ObjectToXML(xml);
   

            if (hdon != null) {
              const dd_ar = hdon2
                .getElementsByTagName("DLHDon")[0]
                .getElementsByTagName("NDHDon")[0]
                .getElementsByTagName("DSHHDVu")[0]
                .getElementsByTagName("HHDVu").length;

              if (dd_ar == 0) {
                this.objHoaDonDienTu.Amount = xmlUtil.getFourthLevelContentXml(
                  hdon,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "TToan",
                    fourth: "TgTTTBSo",
                  }
                );
                this.objHoaDonDienTu.Amount_words =
                  xmlUtil.getFourthLevelContentXml(hdon, {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "TToan",
                    fourth: "TgTTTBChu",
                  });
                this.objHoaDonDienTu.ArisingDate = xmlUtil.getThirdLevelContentXml(
                  hdon,
                  { first: "DLHDon", second: "TTChung", third: "NLap" }
                );
                this.objHoaDonDienTu.Buyer = xmlUtil.getFourthLevelContentXml(
                  hdon,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NMua",
                    fourth: "HVTNMHang",
                  }
                );
                this.objHoaDonDienTu.ComAddress = xmlUtil.getFourthLevelContentXml(
                  hdon,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NBan",
                    fourth: "DChi",
                  }
                );
                this.objHoaDonDienTu.ComName = xmlUtil.getFourthLevelContentXml(
                  hdon,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NBan",
                    fourth: "Ten",
                  }
                );
                this.objHoaDonDienTu.ComPhone = xmlUtil.getFourthLevelContentXml(
                  hdon,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NBan",
                    fourth: "SDThoai",
                  }
                );
                this.objHoaDonDienTu.ComTaxCode = xmlUtil.getFourthLevelContentXml(
                  hdon,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NBan",
                    fourth: "MST",
                  }
                );
                this.objHoaDonDienTu.CusAddress = xmlUtil.getFourthLevelContentXml(
                  hdon,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NMua",
                    fourth: "DChi",
                  }
                );
                this.txtDiaChi = this.objHoaDonDienTu.CusAddress;
                console.log("this.objHoaDonDienTu.CusAddress1", this.objHoaDonDienTu.CusAddress)
                this.objHoaDonDienTu.CusBankName =
                  xmlUtil.getFourthLevelContentXml(hdon, {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NMua",
                    fourth: "TNHang",
                  });
                this.objHoaDonDienTu.CusCode = xmlUtil.getFourthLevelContentXml(
                  hdon,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NMua",
                    fourth: "MKHang",
                  }
                );
                this.objHoaDonDienTu.CusName = xmlUtil.getFourthLevelContentXml(
                  hdon,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NMua",
                    fourth: "Ten",
                  }
                );
                this.objHoaDonDienTu.CusPhone = xmlUtil.getFourthLevelContentXml(
                  hdon,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NMua",
                    fourth: "SDThoai",
                  }
                );
                this.objHoaDonDienTu.CusTaxCode = xmlUtil.getFourthLevelContentXml(
                  hdon,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NMua",
                    fourth: "MST",
                  }
                );

                this.objHoaDonDienTu.Extra = xmlUtil.getFourthLevelContentXml(
                  hdon,
                  {
                    first: "DLHDon",
                    second: "TTChung",
                    third: "TTKhac",
                    fourth: "TTruong",
                  }
                );

                this.objHoaDonDienTu.InvoiceName = xmlUtil.getThirdLevelContentXml(
                  hdon,
                  { first: "DLHDon", second: "TTChung", third: "THDon" }
                );
                this.objHoaDonDienTu.InvoiceNo = xmlUtil.getThirdLevelContentXml(
                  hdon,
                  { first: "DLHDon", second: "TTChung", third: "SHDon" }
                );
                this.objHoaDonDienTu.InvoicePattern =
                  xmlUtil.getThirdLevelContentXml(hdon, {
                    first: "DLHDon",
                    second: "TTChung",
                    third: "KHMSHDon",
                  });
                this.objHoaDonDienTu.Kind_of_Payment =
                  xmlUtil.getThirdLevelContentXml(hdon, {
                    first: "DLHDon",
                    second: "TTChung",
                    third: "HTTToan",
                  });
                this.objHoaDonDienTu.SerialNo = xmlUtil.getThirdLevelContentXml(
                  hdon,
                  { first: "DLHDon", second: "TTChung", third: "KHHDon" }
                );
                this.objHoaDonDienTu.Total = xmlUtil.getFourthLevelContentXml(
                  hdon,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "TToan",
                    fourth: "TgTCThue",
                  }
                );
                this.objHoaDonDienTu.VAT_Amount = xmlUtil.getFourthLevelContentXml(
                  hdon,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "TToan",
                    fourth: "TgTThue",
                  }
                );

                try {
                  const tSuat = xmlUtil.getFifthLevelContentXml(hdon, {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "TToan",
                    fourth: "THTTLTSuat",
                    fifth: "TSuat",
                  });
                  if (tSuat === "KKKNT") this.objHoaDonDienTu.VAT_Rate = -2;
                  else if (tSuat === "KCT") this.objHoaDonDienTu.VAT_Rate = -1;
                  else if (tSuat.includes("KHAC:"))
                    this.objHoaDonDienTu.VAT_Rate = 10;
                  else
                    this.objHoaDonDienTu.VAT_Rate = tSuat.substring( 0, tSuat.length - 1);
                } catch (e) {
                  this.objHoaDonDienTu.VAT_Rate = 0;
                }

                let ar_product = [];
                let vat_amout = "";
                let tan_suat = "";
                let product = this.ProductWithSTT();
                let count_t = hdon2
                  .getElementsByTagName("DLHDon")[0]
                  .getElementsByTagName("NDHDon")[0]
                  .getElementsByTagName("DSHHDVu");

                for (var i = 0; i < count_t.length; i++) {
                  product.Amount = hdon
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")
                    [i].getElementsByTagName("TTKhac")[0]
                    .getElementsByTagName("DLieu")[0].textContent;
                  product.Code = hdon
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")
                    [i].getElementsByTagName("MHHDVu")[0].textContent;
                  product.Discount = 0;
                  product.DiscountAmount = 0;

                  product.ProdName = hdon
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")
                    [i].getElementsByTagName("THHDVu")[0].textContent;
                  product.ProdPrice = hdon
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")
                    [i].getElementsByTagName("DGia")[0].textContent;
                  product.ProdQuantity = hdon
                    .getElementsByTagName(DLHDon)[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")
                    [i].getElementsByTagName("SLuong")[0].textContent;
                  product.ProdUnit = hdon
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")
                    [i].getElementsByTagName("DVTinh")[0].textContent;
                  product.Total = hdon
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")
                    [i].getElementsByTagName("ThTien")[0].textContent;

                  vat_amout = hdon
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")
                    [i].getElementsByTagName("TTKhac")[0].textContent;
                  if (vat_amout.Length > 1) {
                    product.VATAmount = hdon
                      .getElementsByTagName("DLHDon")[0]
                      .getElementsByTagName("NDHDon")[0]
                      .getElementsByTagName("DSHHDVu")
                      [i].getElementsByTagName("TTKhac")[1]
                      .getElementsByTagName("DLieu")[0].textContent;
                  } else {
                    product.VATAmount = 0;
                  }

                  tan_suat = hdon
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")
                    [i].getElementsByTagName("TSuat")[0].textContent;
                  if (tan_suat == "KKKNT") {
                    product.VATRate = -2;
                  } else if (tan_suat == "KCT") {
                    product.VATRate = -1;
                  } else if (tan_suat.includes("KHAC:")) {
                    product.VATRate = 10;
                  } else {
                    product.VATRate = tan_suat.substring(
                      0,
                      tan_suat.length - 1
                    );
                  }

                  ar_product.push({
                    STT: Number(i) + 1,
                    Code: product.Code,
                    Remark: product.Remark,
                    Total: product.Total,
                    ProdName: product.ProdName,
                    ProdUnit: product.ProdUnit,
                    ProdQuantity: product.ProdQuantity,
                    ProdPrice: product.ProdPrice,
                    Discount: product.Discount,
                    DiscountAmount: product.DiscountAmount,
                    VATRate: product.VATRate,
                    VATAmount: product.VATAmount,
                    Amount: product.Amount,
                  });
                }

                this.objHoaDonDienTu.Products = ar_product;
              } else {
                this.objHoaDonDienTu.Amount = xmlUtil.getFourthLevelContentXml(
                  hdon2,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "TToan",
                    fourth: "TgTTTBSo",
                  }
                );
                this.objHoaDonDienTu.Amount_words =
                  xmlUtil.getFourthLevelContentXml(hdon2, {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "TToan",
                    fourth: "TgTTTBChu",
                  });
                this.objHoaDonDienTu.ArisingDate = xmlUtil.getThirdLevelContentXml(
                  hdon2,
                  { first: "DLHDon", second: "TTChung", third: "NLap" }
                );
                this.objHoaDonDienTu.ComAddress = xmlUtil.getFourthLevelContentXml(
                  hdon2,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NBan",
                    fourth: "DChi",
                  }
                );
                this.objHoaDonDienTu.ComName = xmlUtil.getFourthLevelContentXml(
                  hdon2,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NBan",
                    fourth: "Ten",
                  }
                );
                this.objHoaDonDienTu.ComPhone = xmlUtil.getFourthLevelContentXml(
                  hdon2,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NBan",
                    fourth: "SDThoai   ",
                  }
                );
                this.objHoaDonDienTu.ComTaxCode = xmlUtil.getFourthLevelContentXml(
                  hdon2,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NBan",
                    fourth: "MST",
                  }
                );
                this.objHoaDonDienTu.CusAddress = this.txtDiaChi = xmlUtil.getFourthLevelContentXml(
                  hdon2,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NMua",
                    fourth: "DChi",
                  }
                );
                // this.txtDiaChi = this.objHoaDonDienTu.CusAddress;
                // console.log("this.objHoaDonDienTu.CusAddress2 ", this.objHoaDonDienTu.CusAddress )
                this.objHoaDonDienTu.CusCode = xmlUtil.getFourthLevelContentXml(
                  hdon2,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NMua",
                    fourth: "MKHang",
                  }
                );
                this.objHoaDonDienTu.CusName = xmlUtil.getFourthLevelContentXml(
                  hdon2,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NMua",
                    fourth: "Ten",
                  }
                );
                this.objHoaDonDienTu.CusPhone = xmlUtil.getFourthLevelContentXml(
                  hdon2,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NMua",
                    fourth: "SDThoai",
                  }
                );
                this.objHoaDonDienTu.CusTaxCode = xmlUtil.getFourthLevelContentXml(
                  hdon2,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "NMua",
                    fourth: "MST",
                  }
                );
                if (this.objHoaDonDienTu.CusTaxCode == "null") {
                  this.objHoaDonDienTu.CusTaxCode = "";
                }
                this.objHoaDonDienTu.InvoiceName = xmlUtil.getThirdLevelContentXml(
                  hdon2,
                  { first: "DLHDon", second: "TTChung", third: "THDon" }
                );
                this.objHoaDonDienTu.InvoiceNo = xmlUtil.getThirdLevelContentXml(
                  hdon2,
                  { first: "DLHDon", second: "TTChung", third: "SHDon" }
                );
                this.objHoaDonDienTu.InvoicePattern =
                  xmlUtil.getThirdLevelContentXml(hdon2, {
                    first: "DLHDon",
                    second: "TTChung",
                    third: "KHMSHDon",
                  });
                this.objHoaDonDienTu.Kind_of_Payment =
                  xmlUtil.getThirdLevelContentXml(hdon2, {
                    first: "DLHDon",
                    second: "TTChung",
                    third: "HTTToan",
                  });
                this.objHoaDonDienTu.SerialNo = xmlUtil.getThirdLevelContentXml(
                  hdon2,
                  { first: "DLHDon", second: "TTChung", third: "KHHDon" }
                );
                this.objHoaDonDienTu.Total = xmlUtil.getFourthLevelContentXml(
                  hdon2,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "TToan",
                    fourth: "TgTCThue",
                  }
                );
                this.objHoaDonDienTu.VAT_Amount = xmlUtil.getFourthLevelContentXml(
                  hdon2,
                  {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "TToan",
                    fourth: "TgTThue",
                  }
                );

                try {
                  const tSuat = xmlUtil.getFifthLevelContentXml(hdon2, {
                    first: "DLHDon",
                    second: "NDHDon",
                    third: "TToan",
                    fourth: "THTTLTSuat",
                    fifth: "TSuat",
                  });
                  if (tSuat === "KKKNT") this.objHoaDonDienTu.VAT_Rate = -2;
                  else if (tSuat === "KCT") this.objHoaDonDienTu.VAT_Rate = -1;
                  else if (tSuat.includes("KHAC:1"))
                    this.objHoaDonDienTu.VAT_Rate = -1;
                  else if (tSuat.includes("KHAC:2"))
                    this.objHoaDonDienTu.VAT_Rate = -2;
                  else
                    this.objHoaDonDienTu.VAT_Rate = tSuat.substring(
                      0,
                      tSuat.length - 1
                    );
                } catch (e) {
                  this.objHoaDonDienTu.VAT_Rate = 0;
                }

                let ar_product = [];
                let vat_amout = "";
                let tan_suat = "";
                let product = this.ProductWithSTT();

                let count_t = hdon2
                  .getElementsByTagName("DLHDon")[0]
                  .getElementsByTagName("NDHDon")[0]
                  .getElementsByTagName("DSHHDVu")[0]
                  .getElementsByTagName("HHDVu");

                for (var i = 0; i < count_t.length; i++) {
                  product.Amount = hdon2
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")[0]
                    .getElementsByTagName("HHDVu")
                    [i].getElementsByTagName("TTKhac")[0]
                    .getElementsByTagName("TTin")[0]
                    .getElementsByTagName("DLieu")[0].textContent;

                  product.Discount = 0;
                  product.DiscountAmount = 0;

                  product.ProdName = hdon2
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")[0]
                    .getElementsByTagName("HHDVu")
                    [i].getElementsByTagName("THHDVu")[0].textContent;

                  product.ProdPrice = hdon2
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")[0]
                    .getElementsByTagName("HHDVu")
                    [i].getElementsByTagName("DGia")[0].textContent;

                  product.ProdQuantity = hdon2
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")[0]
                    .getElementsByTagName("HHDVu")
                    [i].getElementsByTagName("SLuong")[0].textContent;

                  product.Total = hdon2
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")[0]
                    .getElementsByTagName("HHDVu")
                    [i].getElementsByTagName("ThTien")[0].textContent;

                  vat_amout = hdon2
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")[0]
                    .getElementsByTagName("HHDVu")
                    [i].getElementsByTagName("TTKhac")[0]
                    .getElementsByTagName("TTin");

                  if (vat_amout.length > 1) {
                    product.VATAmount = hdon2
                      .getElementsByTagName("DLHDon")[0]
                      .getElementsByTagName("NDHDon")[0]
                      .getElementsByTagName("DSHHDVu")[0]
                      .getElementsByTagName("HHDVu")
                      [i].getElementsByTagName("TTKhac")[0]
                      .getElementsByTagName("TTin")[1]
                      .getElementsByTagName("DLieu")[0].textContent;
                  } else {
                    product.VATAmount = 0;
                  }

                  tan_suat = hdon2
                    .getElementsByTagName("DLHDon")[0]
                    .getElementsByTagName("NDHDon")[0]
                    .getElementsByTagName("DSHHDVu")[0]
                    .getElementsByTagName("HHDVu")
                    [i].getElementsByTagName("TSuat")[0].textContent;
                  if (tan_suat == "KKKNT") {
                    product.VATRate = -2;
                  } else if (tan_suat == "KCT") {
                    product.VATRate = -1;
                  } else if (tan_suat.includes("KHAC:")) {
                    product.VATRate = 10;
                  } else {
                    product.VATRate = tan_suat.substring(
                      0,
                      tan_suat.length - 1
                    );
                  }

                  ar_product.push({
                    STT: Number(i) + 1,
                    Code: product.Code,
                    Remark: product.Remark,
                    Total: product.Total,
                    ProdName: product.ProdName,
                    ProdUnit: product.ProdUnit,
                    ProdQuantity: product.ProdQuantity,
                    ProdPrice: product.ProdPrice,
                    Discount: product.Discount,
                    DiscountAmount: product.DiscountAmount,
                    VATRate: product.VATRate,
                    VATAmount: product.VATAmount,
                    Amount: product.Amount,
                  });
                }

                this.objHoaDonDienTu.Products = ar_product;
              }

              this.objHoaDonDienTuEdit = this.objHoaDonDienTu;

              //Thay đổi mẫu hóa đơn
              try {
                let pattern1 = true;
                if (this.objHoaDonDienTu.Products.length > 1) {
                  let vatrate = this.objHoaDonDienTu.Products[0].VATRate;
                  for (var i = 1; i < this.objHoaDonDienTu.Products.length; i++) {
                    if (
                      this.objHoaDonDienTu.Products[i].ProdName != null &&
                      vatrate != this.objHoaDonDienTu.Products[i].VATRate
                    ) {
                      pattern1 = false;
                      break;
                    }
                  }
                }

                if (pattern1) this.ddlMauSo = this.options.mauso[0]?.id;
                else this.ddlMauSo = this.options.mauso[1]?.id;
              } catch (e) {}

              //label of company
              this.lblTenHoaDon = this.objHoaDonDienTuEdit.InvoiceName;
              this.lblMauSo = this.objHoaDonDienTuEdit.InvoicePattern;
              this.lblKyHieu = this.objHoaDonDienTuEdit.SerialNo;
              this.lblSo_No = this.objHoaDonDienTuEdit.InvoiceNo;
              this.lblMaSoThue = this.objHoaDonDienTuEdit.ComTaxCode;
              this.lblTenDonVi = this.objHoaDonDienTuEdit.ComName;
              this.lblDiaChi = this.objHoaDonDienTuEdit.ComAddress;

              //customer
              this.lblMaSo = this.objHoaDonDienTuEdit.CusCode;
              this.lblThangHoaDon = this.objHoaDonDienTuEdit.KindOfService;
              this.txtTenKhachHang = this.objHoaDonDienTuEdit.CusName;
              this.txtMaSoThue = this.objHoaDonDienTuEdit.CusTaxCode;
              this.txtSoDienThoai = this.objHoaDonDienTuEdit.CusPhone;
              this.txtHinhThucThanhToan = this.objHoaDonDienTuEdit.Kind_of_Payment;
              this.txtTheMoRong = this.objHoaDonDienTuEdit.Extra;
              this.txtTHueGTGT = this.objHoaDonDienTuEdit.VAT_Rate;

            } else {
              let hdon1 = xmlUtil.ObjectToXML(xml)
                .getElementsByTagName("Invoice")[0]
                .getElementsByTagName("Content")[0];

              this.objHoaDonDienTuEdit.InvoiceName = this.lblTenHoaDon =
                hdon1.getElementsByTagName("InvoiceName")[0].textContent;
              this.objHoaDonDienTuEdit.InvoicePattern = this.lblMauSo =
                hdon1.getElementsByTagName("InvoicePattern")[0].textContent;
              this.objHoaDonDienTuEdit.SerialNo = this.lblKyHieu =
                hdon1.getElementsByTagName("SerialNo")[0].textContent;
              this.objHoaDonDienTuEdit.InvoiceNo = this.lblSo_No =
                hdon1.getElementsByTagName("InvoiceNo")[0].textContent;
              this.objHoaDonDienTuEdit.ComTaxCode = this.lblMaSoThue =
                hdon1.getElementsByTagName("ComTaxCode")[0].textContent;
              this.objHoaDonDienTuEdit.ComName = this.lblTenDonVi =
                hdon1.getElementsByTagName("ComName")[0].textContent;
              this.objHoaDonDienTuEdit.ComAddress = this.lblDiaChi =
                hdon1.getElementsByTagName("ComAddress")[0].textContent;
              this.objHoaDonDienTuEdit.CusName = this.txtTenKhachHang =
                hdon1.getElementsByTagName("CusName")[0].textContent;

              this.objHoaDonDienTuEdit.CusAddress = this.txtDiaChi =
                hdon1.getElementsByTagName("CusAddress")[0].textContent;
              this.objHoaDonDienTuEdit.CusTaxCode = this.txtMaSoThue =
                hdon1.getElementsByTagName("CusTaxCode")[0].textContent;
              this.objHoaDonDienTuEdit.CusPhone = this.txtSoDienThoai =
                hdon1.getElementsByTagName("CusPhone")[0].textContent;
              this.objHoaDonDienTuEdit.CusCode = this.lblMaSo =
                hdon1.getElementsByTagName("CusCode")[0].textContent;

              this.objHoaDonDienTuEdit.Kind_of_Payment =
                this.txtHinhThucThanhToan =
                  hdon1.getElementsByTagName("Kind_of_Payment")[0].textContent;
              this.objHoaDonDienTuEdit.KindOfService = this.lblThangHoaDon =
                hdon1.getElementsByTagName("KindOfService")[0].textContent;
              this.objHoaDonDienTuEdit.VAT_Rate = this.txtTHueGTGT =
                hdon1.getElementsByTagName("VAT_Rate")[0].textContent;
              this.objHoaDonDienTuEdit.Extra = this.txtTheMoRong =
                hdon1.getElementsByTagName("Extra")[0].textContent;

              this.objHoaDonDienTuEdit.Products = hdon1
                .getElementsByTagName("Products")[0]
                .getElementsByTagName("Product")[0];

              this.objHoaDonDienTu = this.objHoaDonDienTuEdit;
            }
            console.log("this.objHoaDonDienTuEdit", this.objHoaDonDienTuEdit);
            let ar_new = [];
            for ( var i = 0;i < this.objHoaDonDienTuEdit.Products.length + 3; i++) {
              if (this.objHoaDonDienTuEdit.Products.length <= i) {
                ar_new.push({
                  STT: 1 + Number(i),
                  Code: "",
                  Remark: "",
                  Total: "",
                  ProdName: "",
                  ProdUnit: "",
                  ProdQuantity: "",
                  ProdPrice: "",
                  Discount: "",
                  DiscountAmount: "",
                  VATRate: "",
                  VATAmount: "",
                  Amount: "",
                });
              } else {
                ar_new.push({
                  STT: 1 + Number(i),
                  Code: this.objHoaDonDienTuEdit.Products[i].Code,
                  Remark: this.objHoaDonDienTuEdit.Products[i].Remark,
                  Total: Math.abs(this.objHoaDonDienTuEdit.Products[i].Total),
                  ProdName: this.objHoaDonDienTuEdit.Products[i].ProdName,
                  ProdUnit: this.objHoaDonDienTuEdit.Products[i].ProdUnit,
                  ProdQuantity: Math.abs(
                    this.objHoaDonDienTuEdit.Products[i].ProdQuantity
                  ),
                  ProdPrice: Math.abs(
                    this.objHoaDonDienTuEdit.Products[i].ProdPrice
                  ),
                  Discount: Math.abs(
                    this.objHoaDonDienTuEdit.Products[i].Discount
                  ),
                  DiscountAmount: Math.abs(
                    this.objHoaDonDienTuEdit.Products[i].DiscountAmount
                  ),
                  VATRate: Math.abs(
                    this.objHoaDonDienTuEdit.Products[i].VATRate
                  ),
                  VATAmount: Math.abs(
                    this.objHoaDonDienTuEdit.Products[i].VATAmount
                  ),
                  Amount: Math.abs(this.objHoaDonDienTuEdit.Products[i].Amount),
                });
              }
            }

            this.grid_danhsach = ar_new;

            let vat_amount = 0,
              vat_amount_5 = 0,
              vat_amount_10 = 0;
            let total = 0,
              total_0 = 0,
              total_novat_t = 0,
              total_novat_c = 0,
              total_5 = 0,
              total_10 = 0;
            for (var i = 0; i < this.grid_danhsach.length; i++) {
              vat_amount = vat_amount + Number(this.grid_danhsach[i].VATAmount);
              if (this.grid_danhsach[i].VATRate == 5) {
                vat_amount_5 =
                  vat_amount_5 + Number(this.grid_danhsach[i].VATAmount);
              }
              if (this.grid_danhsach[i].VATRate == 10) {
                vat_amount_10 =
                  vat_amount_10 + Number(this.grid_danhsach[i].VATAmount);
              }
              total = total + Number(this.grid_danhsach[i].Total);
              if (this.grid_danhsach[i].VATRate == 0) {
                total_0 = total_0 + Number(this.grid_danhsach[i].Total);
              }
              if (this.grid_danhsach[i].VATRate == -1) {
                total_novat_c =
                  total_novat_c + Number(this.grid_danhsach[i].Total);
              }
              if (this.grid_danhsach[i].VATRate == -2) {
                total_novat_t =
                  total_novat_t + Number(this.grid_danhsach[i].Total);
              }
              if (this.grid_danhsach[i].VATRate == 5) {
                total_5 = total_5 + Number(this.grid_danhsach[i].Total);
              }
              if (this.grid_danhsach[i].VATRate == 10) {
                total_10 = total_10 + Number(this.grid_danhsach[i].Total);
              }
            }

            this.txtTongTienKhongChiuThue = Math.abs(Number(total_novat_c));
            this.txtTongTienKhongThue = Math.abs(Number(total_novat_t));
            this.txtTongTienChiuThue0 = Math.abs(Number(total_0));
            this.txtTongTienChiuThue5 = Math.abs(Number(total_5));
            this.txtTongTienChiuThue10 = Math.abs(Number(total_10));
            this.txtTongTienThue5 = Math.abs(Number(vat_amount_5));
            this.txtTongTienThue10 = Math.abs(Number(vat_amount_10));
            this.txtCongTienDV = Math.abs(Number(total));
            this.txtTienTHueGTGT = Math.abs(Number(vat_amount));
            this.txtTongCongTienThanhToan = Math.abs(
              Number(this.objHoaDonDienTuEdit.Amount)
            );

            this.objHoaDonDienTuEdit.Total = Math.abs(Number(total));
            this.objHoaDonDienTuEdit.VAT_Amount = Math.abs(Number(vat_amount));
            this.objHoaDonDienTuEdit.Amount =
              Math.abs(Number(total)) +
              Math.abs(Number(this.objHoaDonDienTuEdit.VAT_Amount));

            this.t_tien_load = Math.abs(
              Number(this.objHoaDonDienTuEdit.Amount)
            );
            this.t_tien_edited = Math.abs(
              Number(this.objHoaDonDienTuEdit.Amount)
            );
            await this.doi_so_sang_chu(Number(this.txtTongCongTienThanhToan));
            this.first = false;
            return true;
          } 
          catch (e) {
            let hdon12 = xmlUtil.ObjectToXML(xml)
              .getElementsByTagName("Invoice")[0]
              .getElementsByTagName("Content")[0];

            this.objHoaDonDienTuEdit.InvoiceName = this.lblTenHoaDon =
            hdon12.getElementsByTagName("InvoiceName")[0].textContent;
            this.objHoaDonDienTuEdit.InvoicePattern = this.lblMauSo =
            hdon12.getElementsByTagName("InvoicePattern")[0].textContent;
            this.objHoaDonDienTuEdit.SerialNo = this.lblKyHieu =
            hdon12.getElementsByTagName("SerialNo")[0].textContent;
            this.objHoaDonDienTuEdit.InvoiceNo = this.lblSo_No =
            hdon12.getElementsByTagName("InvoiceNo")[0].textContent;
            this.objHoaDonDienTuEdit.ComTaxCode = this.lblMaSoThue =
            hdon12.getElementsByTagName("ComTaxCode")[0].textContent;
            this.objHoaDonDienTuEdit.ComName = this.lblTenDonVi =
            hdon12.getElementsByTagName("ComName")[0].textContent;
            this.objHoaDonDienTuEdit.ComAddress = this.lblDiaChi =
            hdon12.getElementsByTagName("ComAddress")[0].textContent;
            this.objHoaDonDienTuEdit.CusName = this.txtTenKhachHang =
            hdon12.getElementsByTagName("CusName")[0].textContent;
    
            this.objHoaDonDienTuEdit.CusAddress = this.txtDiaChi = hdon12.getElementsByTagName("CusAddress")[0].textContent;


            this.objHoaDonDienTuEdit.CusTaxCode = this.txtMaSoThue =
            hdon12.getElementsByTagName("CusTaxCode")[0].textContent;
            this.objHoaDonDienTuEdit.CusPhone = this.txtSoDienThoai =
            hdon12.getElementsByTagName("CusPhone")[0].textContent;
            this.objHoaDonDienTuEdit.CusCode = this.lblMaSo =
            hdon12.getElementsByTagName("CusCode")[0].textContent;

            this.objHoaDonDienTuEdit.Kind_of_Payment =
              this.txtHinhThucThanhToan =
              hdon12.getElementsByTagName("Kind_of_Payment")[0].textContent;
            this.objHoaDonDienTuEdit.KindOfService = this.lblThangHoaDon =
            hdon12.getElementsByTagName("KindOfService")[0].textContent;
            this.objHoaDonDienTuEdit.VAT_Rate = this.txtTHueGTGT =
            hdon12.getElementsByTagName("VAT_Rate")[0].textContent;
            this.objHoaDonDienTuEdit.Extra = this.txtTheMoRong =
            hdon12.getElementsByTagName("Extra")[0].textContent;


              let ar_product = [];
              let product = this.ProductWithSTT();
              let count_t = hdon12.getElementsByTagName("Products")[0].getElementsByTagName("Product")

                  for (var i = 0; i < count_t.length; i++) {


                  product.Code = hdon12.getElementsByTagName("Products")[0]
                                       .getElementsByTagName("Product")[i]
                                       .getElementsByTagName("Code")[0].textContent

                  product.Remark = hdon12.getElementsByTagName("Products")[0]
                                       .getElementsByTagName("Product")[i]
                                       .getElementsByTagName("Remark")[0].textContent       


                  product.Total = hdon12.getElementsByTagName("Products")[0]
                                       .getElementsByTagName("Product")[i]
                                       .getElementsByTagName("Total")[0].textContent

                  product.ProdName = hdon12.getElementsByTagName("Products")[0]
                                       .getElementsByTagName("Product")[i]
                                       .getElementsByTagName("ProdName")[0].textContent    

                  product.ProdUnit = hdon12.getElementsByTagName("Products")[0]
                                       .getElementsByTagName("Product")[i]
                                       .getElementsByTagName("ProdUnit")[0].textContent

                  product.ProdQuantity = hdon12.getElementsByTagName("Products")[0]
                                       .getElementsByTagName("Product")[i]
                                       .getElementsByTagName("ProdQuantity")[0].textContent      

                  product.ProdPrice = hdon12.getElementsByTagName("Products")[0]
                                       .getElementsByTagName("Product")[i]
                                       .getElementsByTagName("ProdPrice")[0].textContent


                  product.Discount = hdon12.getElementsByTagName("Products")[0]
                                       .getElementsByTagName("Product")[i]
                                       .getElementsByTagName("Discount")[0].textContent    


                  product.DiscountAmount = hdon12.getElementsByTagName("Products")[0]
                                       .getElementsByTagName("Product")[i]
                                       .getElementsByTagName("DiscountAmount")[0].textContent



                  product.VATRate = hdon12.getElementsByTagName("Products")[0]
                                       .getElementsByTagName("Product")[i]
                                       .getElementsByTagName("VATRate")[0].textContent      


                  product.VATAmount = hdon12.getElementsByTagName("Products")[0]
                                       .getElementsByTagName("Product")[i]
                                       .getElementsByTagName("VATAmount")[0].textContent


                  product.Amount = hdon12.getElementsByTagName("Products")[0]
                                       .getElementsByTagName("Product")[i]
                                       .getElementsByTagName("Amount")[0].textContent 



                  ar_product.push({
                    STT: Number(i) + 1,
                    Code: product.Code,
                    Remark: product.Remark,
                    Total: product.Total,
                    ProdName: product.ProdName,
                    ProdUnit: product.ProdUnit,
                    ProdQuantity: product.ProdQuantity,
                    ProdPrice: product.ProdPrice,
                    Discount: product.Discount,
                    DiscountAmount: product.DiscountAmount,
                    VATRate: product.VATRate,
                    VATAmount: product.VATAmount,
                    Amount: product.Amount,
                  });


                }

                this.objHoaDonDienTuEdit.Products =  ar_product             




            this.grid_danhsach = this.objHoaDonDienTuEdit.Products;

            this.objHoaDonDienTu = this.objHoaDonDienTuEdit;

            let ar_new = [];
            for (
              var i = 0;
              i < this.objHoaDonDienTuEdit.Products.length + 3;
              i++
            ) {
              if (this.objHoaDonDienTuEdit.Products.length <= i) {
                ar_new.push({
                  STT: 1 + Number(i),
                  Code: "",
                  Remark: "",
                  Total: "",
                  ProdName: "",
                  ProdUnit: "",
                  ProdQuantity: "",
                  ProdPrice: "",
                  Discount: "",
                  DiscountAmount: "",
                  VATRate: "",
                  VATAmount: "",
                  Amount: "",
                });
              } else {
                ar_new.push({
                  STT: 1 + Number(i),
                  Code: this.objHoaDonDienTuEdit.Products[i].Code,
                  Remark: this.objHoaDonDienTuEdit.Products[i].Remark,
                  Total: Math.abs(this.objHoaDonDienTuEdit.Products[i].Total),
                  ProdName: this.objHoaDonDienTuEdit.Products[i].ProdName,
                  ProdUnit: this.objHoaDonDienTuEdit.Products[i].ProdUnit,
                  ProdQuantity: Math.abs(
                    this.objHoaDonDienTuEdit.Products[i].ProdQuantity
                  ),
                  ProdPrice: Math.abs(
                    this.objHoaDonDienTuEdit.Products[i].ProdPrice
                  ),
                  Discount: Math.abs(
                    this.objHoaDonDienTuEdit.Products[i].Discount
                  ),
                  DiscountAmount: Math.abs(
                    this.objHoaDonDienTuEdit.Products[i].DiscountAmount
                  ),
                  VATRate: this.objHoaDonDienTuEdit.Products[i].VATRate,
                  VATAmount: Math.abs(
                    this.objHoaDonDienTuEdit.Products[i].VATAmount
                  ),
                  Amount: Math.abs(this.objHoaDonDienTuEdit.Products[i].Amount),
                });
              }
            }

            this.grid_danhsach = ar_new;


            this.txtCongTienDV = this.objHoaDonDienTuEdit.Total
            this.txtTienTHueGTGT = this.objHoaDonDienTuEdit.VAT_Amount
            this.txtTongCongTienThanhToan = this.objHoaDonDienTuEdit.Amount


            this.t_tien_load = Number(this.objHoaDonDienTuEdit.Amount);
            this.t_tien_edited = Number(this.objHoaDonDienTuEdit.Amount);
            await this.doi_so_sang_chu(Number(this.txtTongCongTienThanhToan));
            this.first = false;
            return true;
          }
        }
      } catch (e) {
        this.$toast.error("Lỗi: " + e);
        return false;
      }
    },


    doi_so_sang_chu(tongtien) {
      api.doi_so_sang_chu(this.axios, {
          money: Math.abs(Number(tongtien)),
        })
        .then((res) => {
          this.txtTienVietBangChu = res.data.data ? res.data.data : [];
        });
    },

    async Change_MauSo() {
      let phanvung_id = this.$root.token.getPhanVungID();
      const response = await  api.Change_MauSo(this.axios, { kieu: 1, loaihd_id: this.ddlMauSo,phanvung_id: phanvung_id})
      this.options.kyhieu = apiHelper.getDataFromResponseApiReturnArray(response).map(item =>  {
        return { id: item.seri_id, text: item.seri }
      })

      if(this.options.kyhieu.length > 0){
        this.ddlKyHieu = this.options.kyhieu[0].id;
      }
    },

    async acceptHDDT(item) {
      if (item.vchapnhan == true) {
        this._ma_gd = item.vmagd;
        this.vhdkh_id = item.vhdkh_id;
        this.txtMaGD = this._ma_gd;
        await this.HienThiThongTin();
      }
    },

    btnLayMaGD: async function () {
      //this.$bvModal.show("hoadondt")
      this.$refs.popup_HDDT.showModal();
    },

    Clean() {
      this.bdhddt_cha_id = 0;
      this._dieuchinh = 0;
      this._thaythe = 0;
      this.vma_gd = "";
      this.t_tien_load = 0;
      this.t_tien_edited = 0;
      this.t_tien_tt = 0;
      this.vnhanvien_id = 0;
      //lblThanhToan.Text = "";
      this.vfax = "";
      this.vnguoi_dd = "";
      this.vloai_kh = "";

      this.txtEmail = "";
      this.vstk = "";
      this.vten_nh = "";
      this.vdiachi_tt = "";
      this.lblDiaChi = "";
      this.txtDiaChi = "";
      this.txtTheMoRong = "";
      this.txtBienBanDinhKem = "";
      this.txtGhiCHuHoaDonu = "";
      this.txtHinhThucThanhToan = "";
      this.lblThangHoaDon = "";
      this.lblMaSo = "";
      this.lblMauSo = "";
      this.txtMaSoThue = "";
      this.lblMaSoThue = "";
      this.txtSoDienThoai = "";

      this.vsodt_kh = "";
      this.txtSoHoaDon = "";
      this.lblTenDonVi = "";
      this.lblTenHoaDon = "";
      this.txtTenKhachHang = "";
      this.txtTienVietBangChu = "";

      this.txtTHueGTGT = "10";
      this.txtCongTienDV = "0";
      this.txtTienTHueGTGT = "0";
      this.txtTongCongTienThanhToan = "0";

      this.lblKyHieu = "";
      this.lblSo_No = "";
      this.grid_danhsach = [];

      this.vhdkh_id = 0;
      this.vphieutt_id = "";
      this.khoa = 1;
      this.cboBank.value = 0;
      this.txtSoTaiKhoan = "";
    },

    commandClick(args) {
      if (args.target.classList.contains("custombutton")) {
        this.$confirm(`Bạn có chắc chắn muốn xóa sản phẩm này ?`, {
          confirmButtonText: "Có",
          cancelButtonText: "Không",
          type: "warning",
        }).then(async () => {
          let ar_new = [];
          let stt = 1;
          for (var i = 0; i < this.grid_danhsach.length; i++) {
            if (this.grid_danhsach[i].STT != args.rowData.STT) {
              ar_new.push({
                STT: Number(stt) + i,
                Code: this.grid_danhsach[i].Code,
                Total: this.grid_danhsach[i].Total,
                ProdName: this.grid_danhsach[i].ProdName,
                ProdUnit: this.grid_danhsach[i].ProdUnit,
                ProdQuantity: this.grid_danhsach[i].ProdQuantity,
                ProdPrice: this.grid_danhsach[i].ProdPrice,
                Discount: this.grid_danhsach[i].Discount,
                DiscountAmount: this.grid_danhsach[i].DiscountAmount,
                VATRate: this.grid_danhsach[i].VATRate,
                VATAmount: this.grid_danhsach[i].VATAmount,
                Amount: this.grid_danhsach[i].Amount,
              });
            }
          }

          let count = ar_new.length;
          for (var i = 3; i > 0; i--) {
            if (count < 3) {
              (count = Number(count) + 1),
                ar_new.push({
                  STT: count,
                  Code: "",
                  Total: "",
                  ProdName: "",
                  ProdUnit: "",
                  ProdQuantity: "",
                  ProdPrice: "",
                  Discount: "",
                  DiscountAmount: "",
                  VATRate: "",
                  VATAmount: "",
                  Amount: "",
                });
            }
          }

          this.grid_danhsach = ar_new;

          let tong_total = 0;
          let tong_vatamount = 0;
          let vat0 = 0;
          let vat5 = 0;
          let tien5 = 0;
          let vat10 = 0;
          let tien10 = 0;
          for (var i = 0; i < this.grid_danhsach.length; i++) {
            tong_total = tong_total + this.grid_danhsach[i].Total;
            tong_vatamount = tong_vatamount + this.grid_danhsach[i].VAT_Amount;
            if (this.grid_danhsach[i].VATRate == 0) {
              vat0 = vat0 + this.grid_danhsach[i].Total;
            }
            if (this.grid_danhsach[i].VATRate == 5) {
              tien5 = tien5 + this.grid_danhsach[i].Total;
              vat5 = vat5 + this.grid_danhsach[i].VATAmount;
            }
            if (this.grid_danhsach[i].VATRate == 10) {
              tien10 = tien10 + this.grid_danhsach[i].Total;
              vat10 = vat10 + this.grid_danhsach[i].VATAmount;
            }
          }
          this.objHoaDonDienTuEdit.Total = Number(tong_total);
          this.objHoaDonDienTuEdit.VAT_Amount = Number(tong_vatamount);
          this.objHoaDonDienTuEdit.Amount = Number(tong_total) + Number(tong_vatamount);

          this.txtTongTienChiuThue0 = vat0;
          this.txtTongTienChiuThue5 = tien5;
          this.txtTongTienThue5 = vat5;
          this.txtTongTienChiuThue10 = tien10;
          this.txtTongTienThue10 = vat10;

          this.txtCongTienDV = Number(this.objHoaDonDienTuEdit.Total);
          this.txtTienTHueGTGT = Number(this.objHoaDonDienTuEdit.VAT_Amount);

          if (this.objHoaDonDienTuEdit.Total == 0) {
            this.txtCongTienDV = 0;
            this.txtTienTHueGTGT = 0;
            this.txtTongCongTienThanhToan = 0;
            this.objHoaDonDienTuEdit.Amount = 0;
          }

          await this.doi_so_sang_chu(this.txtTongCongTienThanhToan);
          this.t_tien_edited = Number(this.objHoaDonDienTuEdit.Amount);
        });
      }
    },

    async xuatHDDT_CapNhat(json) {

      //thuôc tính chung 
      const commomProp = {
            
            nguoidung_id: this.$root.token.getNguoiDungID(),
            ma_nd: this.$root.token.getUserName(),
            may_cn: await this.$root.token.getMachine(),
            ip_cn: await this.$root.token.getIP(),
            donvi_id: this.$root.token.getDonViID(),
            bdhddt_cha_id : this.bdhddt_cha_id, //check
            ngay_cn: moment(new Date()).format("DD/MM/YYYY"),
            nhanvien_hd_id: this.vnhanvien_id,
            nhanvien_id: this.$root.token.getNhanVienID(),

            hdkh_id: this.vhdkh_id,
            tag_form: this.Tag,
            thaotac:  this.vthaotac,
            loaihoadon_id: this.ddlMauSo,
            seri_id: this.vseri_id,
            phieutt_id:  this.vphieutt_id,
            ma_gd: this.txtMaGD,   
            secure_xoakhachhang: 0,
            tien_thoaitra: this.t_tien_thoaitra,
            tien_edited: this.t_tien_edited,
            dongbo_test: this.DONGBO_TEST.TEST,
            thoaitra_tmp: this.i_thoaitra_tmp,
      }

      const ds_para = _.merge(commomProp, json)

      const res = await api.CapNhat(this.axios, {
        ds_para: JSON.stringify(ds_para),
      });
  
      let dsach = res.data.data ? res.data.data : null;
      if(dsach){
        return  JSON.parse(dsach.js_returnds);
      }
      return [];
    },
    //-------------------------------------------Xử lý chức năng---------------------------------------------------



    async CapNhat() {
      try{

        const checkdltt = await this.kiemtraVthaotac();
        if(!checkdltt) return;

        this.button.capnhat = false;

        const checkDuLieu = await this.Kiemtra_dulieu(this.vthaotac)

        if (!checkDuLieu) {
          this.button.capnhat = true;
          return;
        }
 
          switch(Number(this.vthaotac)) {
              case 2:
                // Điều chỉnh hóa đơn
                await this.hanldeDieuChinhHoaDon()
                break;
              case 3:
                // Thay thế hóa đơn
                await this.handleThayTheHoaDon()
                break;
              case 4:
                // // Hủy hóa đơn
                await this.handleHuyHoaDon();
              case 5:
                // Hủy thanh toán + Hủy hóa đơn
                await this.handleHuyThanhToan_HuyHoaDon();
                break;
              case 6: 
                // Xuat moi + Gach NO
                await this.handleXuatMoi_GachNo();
                break; 
              case 7:
                // gạch nợ
                await this.handleGachNo();
                break;
              case 9:
                // Chuyển đổi chứng minh nguồn gốc
                await this.handleChuyenDoiChungMinhNguonGoc();
                break;
              case 10: 
                // Chuyển đổi chứng minh để lưu trữ
                await this.hanldeChuyenDoiChungMinhDeLuuTru();
                break;    
              default:

            }
      } catch(err){
        this.button.capnhat = true;
        console.log(err);
      }
      this.button.capnhat = true;
      this.HienThiThongTin();
    },

    async kiemtraVthaotac(){
      if (this.vthaotac == 0) {
        this.$toast.error("Bạn chưa chọn thao tác !");
        return false;
      }
      if (this.vthaotac != 1 && this.vthaotac != 6 && this.da_xuathd == false && this.vpayment == 0) {
        this.$toast.error(
          "Chưa xuất hóa đơn điện tử. Bạn không thể chọn thao tác này !"
        );
        return false;
      }
      if(this.vthaotac == 2 || this.vthaotac == 5){
        // Điều chỉnh hóa đơn
        let ktra = await this.get_app_config();
        if (ktra.dongbo == 0) {
          this.$toast.error(
            "Bạn không có quyền kích hoạt. Vui lòng liên hệ admin để được xử lý!"
          );
          return false; 
        }
        this.DONGBO_TEST.TEST = ktra.keyvalue; // check lai de lam gi
      }
      return true 

    },

    async hanldeDieuChinhHoaDon(){
      try{
        this.loading(true);

        if (! await this.Thoai_Tra())  return;

        let strErr = ""
        if(this.vtt_hddt_hd_user == 1)
          strErr = await this.DieuChinhHoaDon_VTT();
        else
          strErr = await this.DieuChinhHoaDon(); 

        this.loading(false);
        if(strErr != "OK"){
          this.$toast.error(strErr);
          return;
        }
        this.$toast.success("Điều Chỉnh Hoá Đơn Thành Công");
      }catch(err){
        console.log(err)
        this.loading(false);
        this.$toast.error(err);
      }
        
        
    },

    async handleThayTheHoaDon(){
        // Thay thế hóa đơn
        try{

          this.loading(true);
      
          if (! await this.Thoai_Tra())  return;

          let strErr = "" 
          if (this.vtt_hddt_hd_user == 1) 
            strErr = await this.ThayTheHoaDon_VTT();
          else 
            strErr = await this.ThayTheHoaDon();
          
          if(strErr != "OK"){
            this.$toast.error(strErr);
            return;
          }
          this.$toast.success("Thay thế hóa đơn Thành Công");
        } catch(err){
          console.log(err)
          this.loading(false);
          this.$toast.error(err);
        }  
    },

    async handleHuyHoaDon(){
      //todo 
      
    },
    async handleHuyThanhToan_HuyHoaDon(){

      try{
  
        this.loading(true);

        if (!await this.Thoai_Tra())  return;
        //update 18/06/2024
        if (!await this.checkHuyHoaDon_HDThoaiTraTam())  return;
        
        let strErr = "" 
        if (this.vtt_hddt_hd_user == 1) {
          strErr = await this.HuyThanhToan_HuyHoaDon_VTT();
        } else {
          let det_tmp = this.ds_tb.filter(function (ds) {
            return ds.TYLE_VAT != 10;
          });
          if (this.vxuat_hd_nhieumucthue && det_tmp.length > 0){
            strErr = await this.HuyThanhToan_HuyHoaDon_v2();
          }
          else{
            strErr = await this.HuyThanhToan_HuyHoaDon();
          }
        }
        this.loading(false);
        if(strErr != "OK"){
          this.$toast.error(strErr);
          return;
        }else{
          this.$toast.success("Huỷ Hoá đơn Thành Công");
        }
       

      } catch(err){
          console.log(err)
          this.loading(false);
          this.$toast.error(err);
      }
    },

    async handleXuatMoi_GachNo(){
      try{
        if(this.count != 0 ) return;
        
        this.loading(true);
        // Xuất mới hóa đơn + gạch nợ

        this.count = 1;
        const checkDuLieu = await this.Kiemtra_dulieu(this.vthaotac)

        if (checkDuLieu) {

          const ktraxuathdon = await this.KiemtraXuatHoaDon();
          
          if(ktraxuathdon == 0)
          {
            this.$toast.error('Hóa đơn này đã được xuất!!!');
            this.loading(false);
            return
          }
          
          let strError = '';
          if(this.vtt_hddt_hd_user == 1)
          {
            strError = await this.Xuathoadon_GachNo_VTT();
          }
          else
          {
            strError = await this.Xuathoadon_GachNo();
          }
          
          this.loading(false);

          if(strError !="OK"){
            this.$toast.error(strError);
          }else{
            this.$toast.success("Xuất hóa đơn và thanh toán thành công!");
          }
          
        }
      } catch(err){
        this.loading(false);
        this.$toast.error("" + err);
      }
        
    },

    async handleGachNo(){

      try{
        this.loading(true);

        let strError = await this.GachNo();

        this.loading(false);

        if(strError !="OK"){
          this.$toast.error(strError);
          return;
        }
        this.$toast.success("Cap Nhật thành công!");
      
      }catch(err){
        this.loading(false);
        this.$toast.error("" + err);
      }
        //gach no
        
    },


    async handleChuyenDoiChungMinhNguonGoc(){
    
      try{
        this.loading(true);
        await this.ChuyenDoi_XacMinh();
      } catch(err){
        this.loading(false);
        this.$toast.error("" + err);
      }
        
        
    
    },
    async hanldeChuyenDoiChungMinhDeLuuTru(){
  
      
        if (this.vtt_hddt_hd_user == 1) 
          await  this.ChuyenDoi_LuuTru_VTT(); //show modal
        else 
          await this.ChuyenDoi_LuuTru(); //show modal
        
    },
    async KiemtraXuatHoaDon() {
      const res = await api.KiemtraXuatHoaDon(this.axios, this.vphieutt_id);
      return res.data.data ? res.data.data : 0;
    },

    async UpdateCus(xml) {
      const res = await api.UpdateCus(this.axios, {
        convert: 0,
        xmlCusData: xml,
      });
      return res.data.data ? res.data.data : 0;
    },
    async UpdateCus_VTT(xml) {
      const res = await api.UpdateCus_VTT(this.axios, {
        convert: 0,
        xmlCusData: xml,
      });
      return res.data.data ? res.data.data : 0;
    },

    async GET_FKEY() {
      let key = "";
      const response = await api.GET_FKEY(this.axios, {});
      let data = response.data.data ? response.data.data : [];
      key = data[0].fkey;

      return key;
    },

    async ImportAndPublishInv(account, acPass, xmlInvData, pattern, serial) {
      const res = await api.ImportAndPublishInv(this.axios, {
        acPass: acPass,
        account: account,
        convert: 0,
        pattern: pattern,
        serial: serial,
        xmlInvData: xmlInvData,
        cusCode: this.txtMaGD?.trim()
      });

      if(res.data.errorCode == 1){
        return res.data.faultString
      }
      return res.data.data ? res.data.data : res.data.faultString;
    },

    async ImportAndPublishInv_VTT(account, acPass, xmlInvData, pattern, serial) {
      const res = await api.ImportAndPublishInv_VTT(this.axios, {
        acPass: acPass,
        account: account,
        convert: 0,
        pattern: pattern,
        serial: serial,
        xmlInvData: xmlInvData,
      });

      if(res.data.errorCode == 1){
        return res.data.faultString
      }
      return res.data.data ? res.data.data : res.data.faultString;
    },


    async GetInvoiceXml() {
      this.Fkey = await this.GET_FKEY();
      let xml = "<Invoices><Inv>";
      xml += `<key>${this.Fkey}</key>`;
      xml += "<Invoice>";
      xml += `<CusCode>${this.vma_gd}</CusCode>`;
      xml += `<CusName><![CDATA[${this.txtTenKhachHang}]]></CusName>`;
      xml += `<CusAddress><![CDATA[${this.txtDiaChi}]]></CusAddress>`;
      xml += `<CusPhone><![CDATA[${this.txtSoDienThoai}]]></CusPhone>`;
      if (this.txtMaSoThue != null) {
        xml += `<CusTaxCode>${this.txtMaSoThue}</CusTaxCode>`;
      } else {
        xml += `<CusTaxCode></CusTaxCode>`;
      }
      xml += "<PaymentMethod>Tiền mặt/Chuyển khoản</PaymentMethod>";
      xml += "<KindOfService></KindOfService>";
      if (this.vthem_extra) xml += `<Extra>${this.Fkey}</Extra>`;
      xml += "<Products>";

      for (var i = 0; i < this.grid_danhsach; i++) {
        if (this.grid_danhsach[i].ProdName != null) {
          xml += "<Product>";
          xml += `<ProdName><![CDATA[${this.grid_danhsach[i].ProdName}]]></ProdName>`;
          xml += `<ProdUnit>${this.grid_danhsach[i].ProdUnit}</ProdUnit>`;
          xml += `<ProdQuantity>${this.grid_danhsach[i].ProdQuantity}</ProdQuantity>`;
          xml += `<ProdPrice>${this.grid_danhsach[i].ProdPrice}</ProdPrice>`;
          xml += `<Amount>${this.grid_danhsach[i].Amount}</Amount>`;
          xml += "</Product>";
        }
      }
      xml += "</Products>";

      xml += `<Total>${Math.abs(Number(this.txtCongTienDV))}</Total>`;
      xml += "<DiscountAmount></DiscountAmount>";
      xml += `<VATRate>${this.txtTHueGTGT}</VATRate>`;
      xml += `<VATAmount>${Math.abs(Number(this.txtTienTHueGTGT))}</VATAmount>`;
      xml += `<Amount>${Math.abs(
        Number(this.txtTongCongTienThanhToan)
      )}</Amount>`;
      xml += `<AmountInWords>${this.txtTienVietBangChu}</AmountInWords>`;
      xml += `<Teller>${this.$root.token.getMaNhanVien()}</Teller>`;
      xml += "</Invoice></Inv></Invoices>";

      return xml;
    },

    async GetInvoiceXml_tt78() {
      this.Fkey = await this.GET_FKEY();

      let nhanvien = this.$root.token.getMaNhanVien();
      let xml = "<Invoices><Inv>";
      xml += `<key>${this.Fkey}</key>`;
      xml += "<Invoice>";
      xml += `<CusCode>${this.vma_gd.trim()}</CusCode>`;
      xml += `<CusName><![CDATA[${this.txtTenKhachHang}]]></CusName>`;
      xml += `<CusAddress><![CDATA[${this.txtDiaChi}]]></CusAddress>`;
       
      xml += `<CusPhone><![CDATA[${this.txtSoDienThoai ||""}]]></CusPhone>`;
      xml += `<CusTaxCode>${this.txtMaSoThue || ""}</CusTaxCode>`;
      //update thêm sô tài khoản
      if(this.tt78_stk_nh && this.cboBank.value != 0 ){
        xml += "<CusBankNo><![CDATA[" + this.txtSoTaiKhoan + "]]></CusBankNo>"
        xml += "<CusBankName><![CDATA[" + this.cboBankName + "]]></CusBankName>"
      }

      
      xml += "<PaymentMethod>Tiền mặt/Chuyển khoản</PaymentMethod>";
      xml += "<KindOfService></KindOfService>";
      if (this.vthem_extra) xml += `<Extra>${this.Fkey}</Extra>`;
      xml += "<Products>";

      for (var i = 0; i < this.grid_danhsach.length; i++) {
        if (this.grid_danhsach[i].ProdName == "") {
        } else {

          xml += "<Product>";
          xml += `<ProdName><![CDATA[${this.grid_danhsach[i].ProdName}]]></ProdName>`;
          if(this.grid_danhsach[i].ProdUnit != null)
          {
            xml += `<ProdUnit>${this.grid_danhsach[i].ProdUnit}</ProdUnit>`;
          }
          else
          {
            xml += `<ProdUnit></ProdUnit>`;
          }
          xml += `<ProdQuantity>${this.grid_danhsach[i].ProdQuantity}</ProdQuantity>`;
          xml += `<ProdPrice>${Math.abs(
            Number(this.grid_danhsach[i].ProdPrice)
          )}</ProdPrice>`;
          xml += `<Total>${Math.abs(
            Number(this.grid_danhsach[i].Total)
          )}</Total>`;
          xml += `<VATRate>${
            Number(this.grid_danhsach[i].VATRate)
          }</VATRate>`;
          xml += `<VATAmount>${Math.abs(
            Number(this.grid_danhsach[i].VATAmount)
          )}</VATAmount>`;
          xml += `<Amount>${Math.abs(
            Number(this.grid_danhsach[i].Amount)
          )}</Amount>`;
          xml += "<IsSum>0</IsSum>";
          xml += "</Product>";
        }
      }

      if (this.txtCongTienDV == null) {
        this.txtCongTienDV = 0;
      }
      if (this.txtTienTHueGTGT == null) {
        this.txtTienTHueGTGT = 0;
      }
      if (this.txtTongCongTienThanhToan == null) {
        this.txtTongCongTienThanhToan = 0;
      }
      if (this.txtTongTienKhongThue == null) {
        this.txtTongTienKhongThue = 0;
      }
      if (this.txtTongTienKhongChiuThue == null) {
        this.txtTongTienKhongChiuThue = 0;
      }
      if (this.txtTongTienChiuThue0 == null) {
        this.txtTongTienChiuThue0 = 0;
      }
      if (this.txtTongTienChiuThue5 == null) {
        this.txtTongTienChiuThue5 = 0;
      }
      if (this.txtTongTienThue5 == null) {
        this.txtTongTienThue5 = 0;
      }
      if (this.txtTongTienChiuThue10 == null) {
        this.txtTongTienChiuThue10 = 0;
      }
      if (this.txtTongTienThue10 == null) {
        this.txtTongTienThue10 = 0;
      }
      xml += "</Products>";
      xml += `<Total>${Math.abs(Number(this.txtCongTienDV))}</Total>`;
      xml += "<DiscountAmount></DiscountAmount>";
      xml += `<VATRate>${this.txtTHueGTGT}</VATRate>`;
      xml += `<VATAmount>${Math.abs(Number(this.txtTienTHueGTGT))}</VATAmount>`;
      xml += `<Amount>${Math.abs(
        Number(this.txtTongCongTienThanhToan)
      )}</Amount>`;
      xml += `<AmountInWords>${this.txtTienVietBangChu}</AmountInWords>`;

      xml += `<GrossValue_NonTax>${Math.abs(
        Number(this.txtTongTienKhongThue)
      )}</GrossValue_NonTax>`;
      xml += `<GrossValue>${Math.abs(
        Number(this.txtTongTienKhongChiuThue)
      )}</GrossValue>`;
      xml += `<GrossValue0>${Math.abs(
        Number(this.txtTongTienChiuThue0)
      )}</GrossValue0>`;
      xml += "<VatAmount0>0</VatAmount0>";
      xml += `<GrossValue5>${Math.abs(
        Number(this.txtTongTienChiuThue5)
      )}</GrossValue5>`;

      xml += `<VatAmount5>${Math.abs(
        Number(this.txtTongTienThue5)
      )}</VatAmount5>`;
      xml += `<GrossValue10>${Math.abs(
        Number(this.txtTongTienChiuThue10)
      )}</GrossValue10>`;
      xml += `<VatAmount10>${Math.abs(
        Number(this.txtTongTienThue10)
      )}</VatAmount10>`;

      xml += `<Teller>${nhanvien}</Teller>`;
      xml += "</Invoice></Inv></Invoices>";
      return xml;
    
    
    },

    async GetInvoiceXml_DieuChinh(obj) {
      this.fkey_new = await this.GET_FKEY();
      let xml = "<AdjustInv>";
      xml += `<key>${this.fkey_new}</key>`;
      xml += `<CusCode>${obj.CusCode}</CusCode>`;
      xml += `<CusName><![CDATA[${obj.CusName}]]></CusName>`;
      xml += `<CusAddress><![CDATA[${obj.CusAddress}]]></CusAddress>`;
      xml += `<CusPhone><![CDATA[${obj.CusPhone}]]></CusPhone>`;
      if (obj.CusTaxCode != null) {
        xml += `<CusTaxCode>${obj.CusTaxCode}</CusTaxCode>`;
      } else {
        xml += `<CusTaxCode></CusTaxCode>`;
      }

      xml += `<PaymentMethod>${obj.Kind_of_Payment}</PaymentMethod>`;
      xml += `<KindOfService>${obj.KindOfService}</KindOfService>`;

      let type =this.ddlKieuDieuChinh == 1 ? "2" : this.ddlKieuDieuChinh == 2 ? "3" : "4";
      xml += `<Type>${type}></Type>`;
      if (this.vthem_extra) xml += `<Extra>${this.fkey_new}></Extra>`;
      xml += "<Products>";

      for (var i = 0; i < obj.Products.length; i++) {
        xml += "<Product>";
        xml += `<ProdName><![CDATA[${obj.Products[i].ProdName}]]></ProdName>`;
        xml += `<ProdUnit><${obj.Products[i].ProdUnit}></ProdUnit>`;
        xml += `<ProdQuantity>${obj.Products[i].ProdQuantity}></ProdQuantity>`;
        if (obj.Products[i].ProdPrice != null) {
          xml += `<ProdPrice>${Math.abs(
            Number(obj.Products[i].ProdPrice)
          )}></ProdPrice>`;
        } else {
          xml += `<ProdPrice>${obj.Products[i].ProdPrice}></ProdPrice>`;
        }
        if (obj.Products[i].Amount != null) {
          if (obj.Products[i].Amount != 0) {
            xml += `<Amount>${Math.abs(
              Number(obj.Products[i].Amount)
            )}></Amount>`;
          } else {
            xml += "<Amount></Amount>";
          }
        } else {
          xml += `<Amount>${obj.Products[i].Amount}</Amount>`;
        }
        xml += "</Product>";
      }

      xml += "</Products>";
      if (obj.Total != null) {
        xml += `<Total>${Math.abs(Number(obj.Total))}</Total>`;
      } else {
        xml += `<Total>${obj.Total}</Total>`;
      }
      xml += `<VATRate>${obj.VATRate}</VATRate>`;

      if (obj.VAT_Amount != null) {
        if (obj.VAT_Amount != 0) {
          xml += `<VAT_Amount>${Math.abs(Number(obj.VAT_Amount))}</VAT_Amount>`;
        } else {
          xml += "<VATAmount></VATAmount>";
        }
      } else {
        xml += `<VAT_Amount>${obj.VAT_Amount}</VAT_Amount>`;
      }

      if (obj.Amount != null) {
        xml += `<Amount>${Math.abs(Number(obj.Amount))}</Amount>`;
      } else {
        xml += `<Amount>${obj.Amount}></Amount>`;
      }
      if (obj.Amount != null && obj.Amount != 0) {
        xml += `<AmountInWords>${obj.Amount_words}</AmountInWords>`;
      } else {
        xml += `<AmountInWords></AmountInWords>`;
      }

      xml += `<Teller>${this.$root.token.getMaNhanVien()}</Teller>`;
      xml += "</AdjustInv>";

      return xml;
    },

    async GetInvoiceXml_DieuChinh_tt78(obj) {
      this.fkey_new = await this.GET_FKEY();
      let xml = "<AdjustInv>";
      xml += `<key>${this.fkey_new}</key>`;
      xml += `<CusCode>${obj.CusCode}</CusCode>`;
      xml += `<CusName><![CDATA[${obj.CusName}]]></CusName>`;
      xml += `<CusAddress><![CDATA[${obj.CusAddress}]]></CusAddress>`;
      xml += `<CusPhone><![CDATA[${obj.CusPhone}]]></CusPhone>`;
      xml += `<CusTaxCode><![CDATA[${obj.CusTaxCode}]]></CusTaxCode>`;
      xml += `<PaymentMethod>${obj.Kind_of_Payment}</PaymentMethod>`;
      xml += `<KindOfService>${obj.KindOfService}</KindOfService>`;

      const type = this.ddlKieuDieuChinh == 1 ? "2" : this.ddlKieuDieuChinh == 2 ? "3" : "4";
      xml += `<Type>${type}</Type>`;
      if (this.vthem_extra) xml += `<Extra>${this.fkey_new}</Extra>`;
      xml += "<Products>";

      for (var i = 0; i < obj.Products.length; i++) {
        if (
          obj.Products[i].ProdName.trim() == null ||
          obj.Products[i].ProdName.trim() == ""
        ) {
        } else {
          xml += "<Product>";
          xml += `<ProdName><![CDATA[${obj.Products[i].ProdName}]]></ProdName>`;
          xml += `<ProdUnit>${obj.Products[i].ProdUnit}</ProdUnit>`;
          xml += `<ProdQuantity>${obj.Products[i].ProdQuantity}</ProdQuantity>`;
          if (obj.Products[i].ProdPrice != null) {
            xml += `<ProdPrice>${Math.abs(
              Number(obj.Products[i].ProdPrice)
            )}</ProdPrice>`;
          } else {
            xml += `<ProdPrice>${obj.Products[i].ProdPrice}</ProdPrice>`;
          }

          if (obj.Products[i].Amount != null) {
            if (obj.Products[i].Amount != 0) {
              xml += `<Amount>${Math.abs(
                Number(obj.Products[i].Amount)
              )}</Amount>`;
            } else {
              xml += "<Amount>0</Amount>";
            }
          } else {
            xml += `<Amount>${obj.Products[i].Amount}</Amount>`;
          }

          if (obj.Products[i].Total != null) {
            if (obj.Products[i].Total != 0) {
              xml += `<Total>${Math.abs(
                Number(obj.Products[i].Total)
              )}</Total>`;
            } else {
              xml += "<Total>0</Total>";
            }
          } else {
            xml += `<Total>${obj.Products[i].Total}</Total>`;
          }

          if (obj.Products[i].VATRate != null) {
            if (obj.Products[i].VATRate != 0) {
              xml += `<VATRate>${
                Number(obj.Products[i].VATRate)
              }</VATRate>`;
            } else {
              xml += "<VATRate>0</VATRate>";
            }
          } else {
            xml += `<VATRate>0</VATRate>`;
          }

          if (obj.Products[i].VATAmount != null) {
            if (obj.Products[i].VATAmount != 0) {
              xml += `<VATAmount>${Math.abs(
                Number(obj.Products[i].VATAmount)
              )}</VATAmount>`;
            } else {
              xml += "<VATAmount>0</VATAmount>";
            }
          } else {
            xml += `<VATAmount>${obj.Products[i].VATAmount}</VATAmount>`;
          }

          xml += "</Product>";
        }
      }

      xml += "</Products>";

      if (obj.Total != null) {
        xml += `<Total>${Math.abs(Number(obj.Total))}</Total>`;
      } else {
        xml += `<Total>${obj.Total}</Total>`;
      }
      xml += `<VATRate>${obj.VAT_Rate}</VATRate>`;

      if (obj.VAT_Amount != null) {
        if (obj.VAT_Amount != 0) {
          xml += `<VATAmount>${Math.abs(Number(obj.VAT_Amount))}</VATAmount>`;
        } else {
          xml += "<VATAmount></VATAmount>";
        }
      } else {
        xml += `<VATAmount>${obj.VAT_Amount}</VATAmount>`;
      }

      if (obj.Amount != null) {
        xml += `<Amount>${Math.abs(Number(obj.Amount))}</Amount>`;
      } else {
        xml += `<Amount>${obj.Amount}></Amount>`;
      }

      if (obj.Amount != null && obj.Amount != 0)
        xml += `<AmountInWords>${obj.Amount_words}</AmountInWords>`;
      else xml += "<AmountInWords>\\</AmountInWords>";

      xml += `<GrossValue_NonTax>${Math.abs(
        Number(this.txtTongTienKhongThue)
      )}</GrossValue_NonTax>`;
      xml += `<GrossValue>${Math.abs(
        Number(this.txtTongTienKhongChiuThue)
      )}</GrossValue>`;
      xml += `<GrossValue0>${Math.abs(
        Number(this.txtTongTienChiuThue0)
      )}</GrossValue0>`;
      xml += "<VatAmount0>0</VatAmount0>";
      xml += `<GrossValue5>${Math.abs(
        Number(this.txtTongTienChiuThue5)
      )}</GrossValue5>`;
      xml += `<VatAmount5>${Math.abs(
        Number(this.txtTongTienThue5)
      )}</VatAmount5>`;
      xml += `<GrossValue10>${Math.abs(
        Number(this.txtTongTienChiuThue10)
      )}</GrossValue10>`;
      xml += `<VatAmount10>${Math.abs(
        Number(this.txtTongTienThue10)
      )}</VatAmount10>`;
      xml += "<PaymentStatus>1</PaymentStatus>";

      xml += `<Teller>${this.$root.token.getMaNhanVien()}</Teller>`;
      xml += "</AdjustInv>";

      return xml;
    },

    async GetInvoiceXml_ThayThe(obj) {
      this.fkey_new = await this.GET_FKEY();
      let xml = "<ReplaceInv>";
      xml += `<key>${this.fkey_new}</key>`;
      xml += `<CusCode>${obj.CusCode}</CusCode>`;
      xml += `<CusName>${obj.CusName}</CusName>`;
      xml += `<CusAddress>${obj.CusAddress}</CusAddress>`;
      xml += `<CusPhone>${obj.CusPhone}</CusPhone>`;
      if (obj.CusTaxCode != null) {
        xml += `<CusTaxCode>${obj.CusTaxCode}</CusTaxCode>`;
      } else {
        xml += `<CusTaxCode></CusTaxCode>`;
      }

      xml += `<PaymentMethod>${obj.Kind_of_Payment}</PaymentMethod>`;
      xml += `<KindOfService>${obj.KindOfService}</KindOfService>`;

      if (this.vthem_extra) xml += `<Extra>${this.fkey_new}</Extra>`;
      xml += "<Products>";

      for (var i = 0; i < obj.Products.length; i++) {
        xml += "<Product>";
        xml += `<ProdName>${obj.Products[i].ProdName}</ProdName>`;
        xml += `<ProdUnit><${obj.Products[i].ProdUnit}</ProdUnit>`;
        xml += `<ProdQuantity>${obj.Products[i].ProdQuantity}</ProdQuantity>`;
        if (obj.Products[i].ProdPrice != null) {
          xml += `<ProdPrice>${Math.abs(
            Number(obj.Products[i].ProdPrice)
          )}</ProdPrice>`;
        } else {
          xml += `<ProdPrice>${obj.Products[i].ProdPrice}</ProdPrice>`;
        }

        if (obj.Products[i].Amount != null) {
          xml += `<Amount>${Math.abs(Number(obj.Products[i].Amount))}</Amount>`;
        } else {
          xml += `<Amount>${obj.Products[i].Amount}</Amount>`;
        }

        xml += "</Product>";
      }

      xml += "</Products>";

      if (obj.Total != null) {
        xml += `<Total>${Math.abs(Number(obj.Total))}</Total>`;
      } else {
        xml += `<Total>${obj.Total}</Total>`;
      }

      xml += `<VATRate>${obj.VATRate}</VATRate>`;

      if (obj.VATAmount != null) {
        xml += `<VATAmount>${Math.abs(Number(obj.VATAmount))}</VATAmount>`;
      } else {
        xml += `<VATAmount>${obj.VATAmount}</VATAmount>`;
      }

      if (obj.Amount != null) {
        xml += `<Amount>${Math.abs(Number(obj.Amount))}</Amount>`;
      } else {
        xml += `<Amount>${obj.Amount}</Amount>`;
      }

      xml += `<AmountInWords>${obj.AmountInWords}</AmountInWords>`;
      xml += `<Teller>${this.$root.token.getMaNhanVien()}</Teller>`;
      xml += "</ReplaceInv>";

      return xml;
    },

    async GetInvoiceXml_ThayThe_tt78(obj) {
      console.log('GetInvoiceXml_ThayThe_tt78 ', obj)
      this.fkey_new = await this.GET_FKEY();

      let xml = "<ReplaceInv>";
      xml += `<key>${this.fkey_new}</key>`;
      xml += `<CusCode>${obj.CusCode}</CusCode>`;
      xml += `<CusName>${obj.CusName}</CusName>`;
      xml += `<CusAddress>${obj.CusAddress}</CusAddress>`;
      xml += `<CusPhone>${obj.CusPhone}</CusPhone>`;
      if (obj.CusTaxCode != null) {
        xml += `<CusTaxCode>${obj.CusTaxCode}</CusTaxCode>`;
      } else {
        xml += `<CusTaxCode></CusTaxCode>`;
      }
      xml += `<PaymentMethod>${obj.Kind_of_Payment}</PaymentMethod>`;
      xml += `<KindOfService>${obj.KindOfService}</KindOfService>`;

      if (this.vthem_extra) xml += `<Extra>${this.fkey_new}</Extra>`;
      xml += "<Products>";
      for (var i = 0; i < obj.Products.length; i++) {
        if (obj.Products[i].ProdName != "") {
          xml += "<Product>";
          xml += `<ProdName>${obj.Products[i].ProdName}</ProdName>`;
          xml += `<ProdUnit>${obj.Products[i].ProdUnit}</ProdUnit>`;
          xml += `<ProdQuantity>${obj.Products[i].ProdQuantity}</ProdQuantity>`;
          if (obj.Products[i].ProdPrice != null) {
            xml += `<ProdPrice>${Math.abs(
              Number(obj.Products[i].ProdPrice)
            )}</ProdPrice>`;
          } else {
            xml += `<ProdPrice>${obj.Products[i].ProdPrice}</ProdPrice>`;
          }
          if (obj.Products[i].Amount != null) {
            xml += `<Amount>${Math.abs(
              Number(obj.Products[i].Amount)
            )}</Amount>`;
          } else {
            xml += `<Amount>${obj.Products[i].Amount}</Amount>`;
          }
          if (obj.Products[i].Total != null) {
            if (obj.Products[i].Total != 0)
              xml += `<Total>${Math.abs(
                Number(obj.Products[i].Total)
              )}</Total>`;
            else xml += "<Total>0</Total>";
          } else {
            xml += `<Total>${obj.Products[i].Total}</Total>`;
          }
          if (obj.Products[i].VATRate != null) {
            if (obj.Products[i].VATRate != 0)
              xml += `<VATRate>${
                Number(obj.Products[i].VATRate)
              }</VATRate>`;
            else xml += "<VATRate></VATRate>";
          } else {
            xml += `<VATRate>${obj.Products[i].VATRate}</VATRate>`;
          }
          if (obj.Products[i].VATAmount != null) {
            if (obj.Products[i].VATAmount != 0)
              xml += `<VATAmount>${Math.abs(
                Number(obj.Products[i].VATAmount)
              )}</VATAmount>`;
            else xml += "<VATAmount></VATAmount>";
          } else {
            xml += `<VATAmount>${obj.Products[i].VATAmount}</VATAmount>`;
          }
          xml += "</Product>";
        }
      }

      xml += "</Products>";
      if (obj.Total != null) {
        xml += `<Total>${Math.abs(Number(obj.Total))}</Total>`;
      } else {
        xml += `<Total>${obj.Total}</Total>`;
      }

      xml += `<VATRate>${obj.VAT_Rate}</VATRate>`;

      if (obj.VAT_Amount != null) {
        xml += `<VATAmount>${Math.abs(Number(obj.VAT_Amount))}</VATAmount>`;
      } else {
        xml += `<VATAmount>${obj.VAT_Amount}</VATAmount>`;
      }

      if (obj.Amount != null) {
        xml += `<Amount>${Math.abs(Number(obj.Amount))}</Amount>`;
      } else {
        xml += `<Amount>${obj.Amount}</Amount>`;
      }

      xml += `<AmountInWords>${this.txtTienVietBangChu}</AmountInWords>`;

      xml += `<GrossValue_NonTax>${Math.abs(
        Number(this.txtTongTienKhongThue)
      )}</GrossValue_NonTax>`;
      xml += `<GrossValue>${Math.abs(
        Number(this.txtTongTienKhongChiuThue)
      )}</GrossValue>`;
      xml += `<GrossValue0>${Math.abs(
        Number(this.txtTongTienChiuThue0)
      )}</GrossValue0>`;
      xml += "<VatAmount0>0</VatAmount0>";
      xml += `<GrossValue5>${Math.abs(
        Number(this.txtTongTienChiuThue5)
      )}</GrossValue5>`;
      xml += `<VatAmount5>${Math.abs(
        Number(this.txtTongTienThue5)
      )}</VatAmount5>`;
      xml += `<GrossValue10>${Math.abs(
        Number(this.txtTongTienChiuThue10)
      )}</GrossValue10>`;
      xml += `<VatAmount10>${Math.abs(
        Number(this.txtTongTienThue10)
      )}</VatAmount10>`;

      xml += "<PaymentStatus>1</PaymentStatus>";

      xml += `<Teller>${this.$root.token.getMaNhanVien()}</Teller>`;
      xml += "</ReplaceInv>";
      return xml;
    },

   async GetInvoiceXml_VTT() {
      this.Fkey = await this.GET_FKEY();
      let xml = "<Invoices>";
      xml += "<Inv>";
      xml += `<key>${this.Fkey}</key>`;
      xml += "<Invoice>";
      xml += `<CusCode>${this.vma_gd}</CusCode>`;
      xml += `<CusName><![CDATA[${this.txtTenKhachHang}]]></CusName>`;
      xml += `<CusAddress><![CDATA[${this.txtDiaChi}]]></CusAddress>`;
      xml += `<CusPhone><![CDATA[${this.txtSoDienThoai || ""}]]></CusPhone>`;
      if (this.txtMaSoThue != null) {
        xml += `<CusTaxCode>${this.txtMaSoThue}</CusTaxCode>`;
      } else {
        xml += `<CusTaxCode></CusTaxCode>`;
      }
      xml += "<PaymentMethod>Tiền mặt/Chuyển khoản</PaymentMethod>";
      xml += "<KindOfService></KindOfService>";

      if (this.vthem_extra) xml += `<Extra>${this.Fkey}</Extra>`;
      xml += "<Products>";

      for (var i = 0; i < this.grid_danhsach.length; i++) {
        if (this.grid_danhsach[i].ProdName != null) {
          xml += "<Product>";
          xml += `<ProdName><![CDATA[${this.grid_danhsach[i].ProdName}]]></ProdName>`;
          xml += `<ProdUnit>${this.grid_danhsach[i].ProdUnit}</ProdUnit>`;
          xml += `<ProdQuantity>${this.grid_danhsach[i].ProdUnit}</ProdQuantity>`;

          xml += `<ProdPrice>${Math.abs(
            Number(this.grid_danhsach[i].ProdPrice)
          )}</ProdPrice>`;
          xml += `<Amount>${Math.abs(
            Number(this.grid_danhsach[i].Amount)
          )}</Amount>`;
          xml += `<Total>${Math.abs(
            Number(this.grid_danhsach[i].Total)
          )}</Total>`;
          xml += "</Product>";
        }
      }

      xml += "</Products>";

      xml += `<Total>${Math.abs(Number(this.txtCongTienDV))}</Total>`;
      xml += "<DiscountAmount></DiscountAmount>";
      xml += `<VATRate>${this.txtTHueGTGT}</VATRate>`;
      xml += `<VATAmount>${Math.abs(Number(this.txtTienTHueGTGT))}</VATAmount>`;
      xml += `<Amount>${Math.abs(
        Number(this.txtTongCongTienThanhToan)
      )}</Amount>`;
      xml += `<AmountInWords>${this.txtTienVietBangChu}</AmountInWords>`;
      xml += `<EmailDeliver><![CDATA[${this.txtEmail || ""}]]></EmailDeliver>`;

      xml += "</Invoice>";
      xml += "</Inv>";
      xml += "</Invoices>";

      return xml;
    },

   async GetInvoiceXml_VTT_tt78() {
      this.Fkey = await this.GET_FKEY();
      let xml = "<Invoices>";
      xml += "<Inv>";
      xml += `<key>${this.Fkey}</key>`;
      xml += "<Invoice>";
      xml += `<CusCode>${this.vma_gd}</CusCode>`;
      xml += `<CusName><![CDATA[${this.txtTenKhachHang}]]></CusName>`;
      xml += `<CusAddress><![CDATA[${this.txtDiaChi}]]></CusAddress>`;
      xml += `<CusPhone><![CDATA[${this.txtSoDienThoai}]]></CusPhone>`;
      if (this.txtMaSoThue != null) {
        xml += `<CusTaxCode>${this.txtMaSoThue}</CusTaxCode>`;
      } else {
        xml += `<CusTaxCode></CusTaxCode>`;
      }

      xml += "<PaymentMethod>Tiền mặt/Chuyển khoản</PaymentMethod>";
      xml += "<KindOfService></KindOfService>";

      if (this.vthem_extra) xml += `<Extra>${this.Fkey}</Extra>`;
      xml += "<Products>";

      for (var i = 0; i < this.grid_danhsach.length; i++) {
        if (this.grid_danhsach[i].ProdName != null) {
          xml += "<Product>";
          xml += `<ProdName><![CDATA[${this.grid_danhsach[i].ProdName}]]></ProdName>`;
          xml += `<ProdUnit>${this.grid_danhsach[i].ProdUnit}</ProdUnit>`;
          xml += `<ProdQuantity>${this.grid_danhsach[i].ProdUnit}</ProdQuantity>`;

          xml += `<ProdPrice>${Math.abs(
            Number(this.grid_danhsach[i].ProdPrice)
          )}</ProdPrice>`;
          xml += `<Amount>${Math.abs(
            Number(this.grid_danhsach[i].Amount)
          )}</Amount>`;
          xml += `<Total>${Math.abs(
            Number(this.grid_danhsach[i].Total)
          )}</Total>`;
          xml += `<VATRate>${Number(this.grid_danhsach[i].VATRate)}</VATRate>`;
          xml += `<VATAmount>${Math.abs(
            Number(this.grid_danhsach[i].VATAmount)
          )}</VATAmount>`;
          xml += "</Product>";
        }
      }

      xml += "</Products>";

      xml += `<Total>${Math.abs(Number(this.txtCongTienDV))}</Total>`;
      xml += "<DiscountAmount></DiscountAmount>";
      xml += `<VATRate>${this.txtTHueGTGT}</VATRate>`;
      xml += `<VATAmount>${Math.abs(Number(this.txtTienTHueGTGT))}</VATAmount>`;
      xml += `<Amount>${Math.abs(
        Number(this.txtTongCongTienThanhToan)
      )}</Amount>`;
      xml += `<AmountInWords>${this.txtTienVietBangChu}</AmountInWords>`;
      xml += `<EmailDeliver><![CDATA[${this.txtEmail||""}]]></EmailDeliver>`;

      xml += `<GrossValue_NonTax>${Math.abs(
        Number(this.txtTongTienKhongThue)
      )}</GrossValue_NonTax>`;
      xml += `<GrossValue>${Math.abs(
        Number(this.txtTongTienKhongChiuThue)
      )}</GrossValue>`;
      xml += `<GrossValue0>${Math.abs(
        Number(this.txtTongTienChiuThue0)
      )}</GrossValue0>`;
      xml += "<VatAmount0>0</VatAmount0>";
      xml += `<GrossValue5>${Math.abs(
        Number(this.txtTongTienChiuThue5)
      )}</GrossValue5>`;
      xml += `<VatAmount5>${Math.abs(
        Number(this.txtTongTienThue5)
      )}</VatAmount5>`;
      xml += `<GrossValue10>${Math.abs(
        Number(this.txtTongTienChiuThue10)
      )}</GrossValue10>`;
      xml += `<VatAmount10>${Math.abs(
        Number(this.txtTongTienThue10)
      )}</VatAmount10>`;

      xml += "</Invoice>";
      xml += "</Inv>";
      xml += "</Invoices>";

      return xml;
    },

   async  GetInvoiceXml_DieuChinh_VTT(obj) {
      this.fkey_new = await this.GET_FKEY();
      let xml = "<AdjustInv>";
      xml += `<key>${this.fkey_new}</key>`;
      xml += `<CusCode>${obj.CusCode}</CusCode>`;
      xml += `<CusName><![CDATA[${obj.CusName}]]></CusName>`;
      xml += `<CusAddress><![CDATA[${obj.CusAddress}]]></CusAddress>`;
      xml += `<CusPhone><![CDATA[${obj.CusPhone}]]></CusPhone>`;
      if (obj.CusTaxCode != null) {
        xml += `<CusTaxCode>${obj.CusTaxCode}</CusTaxCode>`;
      } else {
        xml += `<CusTaxCode></CusTaxCode>`;
      }
      xml += `<PaymentMethod>${obj.Kind_of_Payment}</PaymentMethod>`;
      xml += `<KindOfService>${obj.KindOfService}</KindOfService>`;

      let type =
        this.ddlKieuDieuChinh == 1
          ? "2"
          : this.ddlKieuDieuChinh == 2
          ? "3"
          : "4";
      xml += `<Type>${type}</Type>`;

      if (this.vthem_extra) xml += `<Extra>${this.fkey_new}</Extra>`;
      xml += "<Products>";

      for (var i = 0; i < obj.Products.length; i++) {
        xml += "<Product>";
        xml += `<ProdName><![CDATA[${obj.Products[i].ProdName}]]></ProdName>`;
        xml += `<ProdUnit><${obj.Products[i].ProdUnit}</ProdUnit>`;
        xml += `<ProdQuantity>${obj.Products[i].ProdQuantity}</ProdQuantity>`;
        if (obj.Products[i].ProdPrice != null) {
          xml += `<ProdPrice>${Math.abs(
            Number(obj.Products[i].ProdPrice)
          )}</ProdPrice>`;
        } else {
          xml += `<ProdPrice>${obj.Products[i].ProdPrice}</ProdPrice>`;
        }

        if (obj.Products[i].Amount != null) {
          xml += `<Amount>${Math.abs(Number(obj.Products[i].Amount))}</Amount>`;
        } else {
          xml += `<Amount>${obj.Products[i].Amount}</Amount>`;
        }

        if (obj.Products[i].Amount != null) {
          xml += `<Total>${Math.abs(Number(obj.Products[i].Amount))}</Total>`;
        } else {
          xml += `<Total>${obj.Products[i].Amount}</Total>`;
        }

        xml += "</Product>";
      }

      xml += "</Products>";

      if (obj.Total != null) {
        xml += `<Total>${Math.abs(Number(obj.Total))}</Total>`;
      } else {
        xml += `<Total>${obj.Total}</Total>`;
      }

      xml += `<VATRate>${obj.VATRate}</VATRate>`;

      if (obj.VATAmount != null) {
        xml += `<VATAmount>${Math.abs(Number(obj.VATAmount))}</VATAmount>`;
      } else {
        xml += `<VATAmount>${obj.VATAmount}</VATAmount>`;
      }

      if (obj.Amount != null) {
        xml += `<Amount>${Math.abs(Number(obj.Amount))}</Amount>`;
      } else {
        xml += `<Amount>${obj.Amount}</Amount>`;
      }

      xml += `<AmountInWords>${this.txtTienVietBangChu}</AmountInWords>`;
      xml += "</AdjustInv>";

      return xml;
    },

   async GetInvoiceXml_DieuChinh_VTT_tt78(obj) {
      this.fkey_new = await this.GET_FKEY();
      let xml = "<AdjustInv>";
      xml += `<key>${this.fkey_new}</key>`;
      xml += `<CusCode>${obj.CusCode}</CusCode>`;
      xml += `<CusName><![CDATA[${obj.CusName}]]></CusName>`;
      xml += `<CusAddress><![CDATA[${obj.CusAddress}]]></CusAddress>`;
      xml += `<CusPhone><![CDATA[${obj.CusPhone}]]></CusPhone>`;
      if (obj.CusTaxCode != null) {
        xml += `<CusTaxCode>${obj.CusTaxCode}</CusTaxCode>`;
      } else {
        xml += `<CusTaxCode></CusTaxCode>`;
      }
      xml += `<PaymentMethod>${obj.Kind_of_Payment}</PaymentMethod>`;
      xml += `<KindOfService>${obj.KindOfService}</KindOfService>`;

      let type =
        this.ddlKieuDieuChinh == 1
          ? "2"
          : this.ddlKieuDieuChinh == 2
          ? "3"
          : "4";
      xml += `<Type>${type}</Type>`;

      if (this.vthem_extra) xml += `<Extra>${this.fkey_new}</Extra>`;
      xml += "<Products>";

      for (var i = 0; i < obj.Products.length; i++) {
        xml += "<Product>";
        xml += `<ProdName><![CDATA[${obj.Products[i].ProdName}]]></ProdName>`;
        xml += `<ProdUnit><${obj.Products[i].ProdUnit}</ProdUnit>`;
        xml += `<ProdQuantity>${obj.Products[i].ProdQuantity}</ProdQuantity>`;
        if (obj.Products[i].ProdPrice != null) {
          xml += `<ProdPrice>${Math.abs(
            Number(obj.Products[i].ProdPrice)
          )}</ProdPrice>`;
        } else {
          xml += `<ProdPrice>${obj.Products[i].ProdPrice}</ProdPrice>`;
        }

        if (obj.Products[i].Amount != null) {
          xml += `<Amount>${Math.abs(Number(obj.Products[i].Amount))}</Amount>`;
        } else {
          xml += `<Amount>${obj.Products[i].Amount}</Amount>`;
        }

        if (obj.Products[i].Amount != null) {
          xml += `<Total>${Math.abs(Number(obj.Products[i].Amount))}</Total>`;
        } else {
          xml += `<Total>${obj.Products[i].Amount}</Total>`;
        }

        xml += `<VATRate>${obj.Products[i].VATRate}</VATRate>`;
        if (obj.Products[i].VATAmount != null) {
          xml += `<VATAmount>${Math.abs(
            Number(obj.Products[i].VATAmount)
          )}</VATAmount>`;
        } else {
          xml += `<VATAmount>${obj.Products[i].VATAmount}</VATAmount>`;
        }
        xml += "</Product>";
      }

      xml += "</Products>";

      if (obj.Total != null) {
        xml += `<Total>${Math.abs(Number(obj.Total))}</Total>`;
      } else {
        xml += `<Total>${obj.Total}</Total>`;
      }

      xml += `<VATRate>${obj.VATRate}</VATRate>`;

      if (obj.VATAmount != null) {
        xml += `<VATAmount>${Math.abs(Number(obj.VATAmount))}</VATAmount>`;
      } else {
        xml += `<VATAmount>${obj.VATAmount}</VATAmount>`;
      }

      if (obj.Amount != null) {
        xml += `<Amount>${Math.abs(Number(obj.Amount))}</Amount>`;
      } else {
        xml += `<Amount>${obj.Amount}</Amount>`;
      }

      xml += `<AmountInWords>${this.txtTienVietBangChu}</AmountInWords>`;

      xml += `<GrossValue_NonTax>${Math.abs(
        Number(this.txtTongTienKhongThue)
      )}</GrossValue_NonTax>`;
      xml += `<GrossValue>${Math.abs(
        Number(this.txtTongTienKhongChiuThue)
      )}</GrossValue>`;
      xml += `<GrossValue0>${Math.abs(
        Number(this.txtTongTienChiuThue0)
      )}</GrossValue0>`;
      xml += "<VatAmount0>0</VatAmount0>";
      xml += `<GrossValue5>${Math.abs(
        Number(this.txtTongTienChiuThue5)
      )}</GrossValue5>`;
      xml += `<VatAmount5>${Math.abs(
        Number(this.txtTongTienThue5)
      )}</VatAmount5>`;
      xml += `<GrossValue10>${Math.abs(
        Number(this.txtTongTienChiuThue10)
      )}</GrossValue10>`;
      xml += `<VatAmount10>${Math.abs(
        Number(this.txtTongTienThue10)
      )}</VatAmount10>`;

      xml += "</AdjustInv>";

      return xml;
    },

    async GetInvoiceXml_ThayThe_VTT(obj) {
      this.fkey_new = await this.GET_FKEY();
      let xml = "<ReplaceInv>";
      xml += `<key>${this.fkey_new}</key>`;
      xml += `<CusCode>${obj.CusCode}</CusCode>`;
      xml += `<CusName>${obj.CusName}</CusName>`;
      xml += `<CusAddress>${obj.CusAddress}</CusAddress>`;
      xml += `<CusPhone>${obj.CusPhone}</CusPhone>`;
      if (obj.CusTaxCode != null) {
        xml += `<CusTaxCode>${obj.CusTaxCode}</CusTaxCode>`;
      } else {
        xml += `<CusTaxCode></CusTaxCode>`;
      }

      xml += `<PaymentMethod>${obj.Kind_of_Payment}</PaymentMethod>`;
      xml += `<KindOfService>${obj.KindOfService}</KindOfService>`;

      if (this.vthem_extra) xml += `<Extra>${this.fkey_new}</Extra>`;
      xml += "<Products>";

      for (var i = 0; i < obj.Products.length; i++) {
        xml += "<Product>";
        xml += `<ProdName>${obj.Products[i].ProdName}</ProdName>`;
        xml += `<ProdUnit><${obj.Products[i].ProdUnit}</ProdUnit>`;
        xml += `<ProdQuantity>${obj.Products[i].ProdQuantity}</ProdQuantity>`;
        if (obj.Products[i].ProdPrice != null) {
          xml += `<ProdPrice>${Math.abs(
            Number(obj.Products[i].ProdPrice)
          )}</ProdPrice>`;
        } else {
          xml += `<ProdPrice>${obj.Products[i].ProdPrice}</ProdPrice>`;
        }

        if (obj.Products[i].Amount != null) {
          xml += `<Amount>${Math.abs(Number(obj.Products[i].Amount))}</Amount>`;
        } else {
          xml += `<Amount>${obj.Products[i].Amount}</Amount>`;
        }

        if (obj.Products[i].Amount != null) {
          xml += `<Total>${Math.abs(Number(obj.Products[i].Amount))}</Total>`;
        } else {
          xml += `<Total>${obj.Products[i].Amount}</Total>`;
        }

        xml += "</Product>";
      }

      xml += "</Products>";

      if (obj.Total != null) {
        xml += `<Total>${Math.abs(Number(obj.Total))}</Total>`;
      } else {
        xml += `<Total>${obj.Total}</Total>`;
      }

      xml += `<VATRate>${obj.VATRate}</VATRate>`;

      if (obj.VATAmount != null) {
        xml += `<VATAmount>${Math.abs(Number(obj.VATAmount))}</VATAmount>`;
      } else {
        xml += `<VATAmount>${obj.VATAmount}</VATAmount>`;
      }

      if (obj.Amount != null) {
        xml += `<Amount>${Math.abs(Number(obj.Amount))}</Amount>`;
      } else {
        xml += `<Amount>${obj.Amount}</Amount>`;
      }

      xml += `<AmountInWords>${this.txtTienVietBangChu}</AmountInWords>`;
      xml += `<Teller>${this.$root.token.getMaNhanVien()}</Teller>`;
      xml += "</ReplaceInv>";

      return xml;
    },

    async GetInvoiceXml_ThayThe_VTT_tt78(obj) {
      this.fkey_new = await this.GET_FKEY();
      let xml = "<ReplaceInv>";
      xml += `<key>${this.fkey_new}</key>`;
      xml += `<CusCode>${obj.CusCode}</CusCode>`;
      xml += `<CusName>${obj.CusName}</CusName>`;
      xml += `<CusAddress>${obj.CusAddress}</CusAddress>`;
      xml += `<CusPhone>${obj.CusPhone}</CusPhone>`;
      if (obj.CusTaxCode != null) {
        xml += `<CusTaxCode>${obj.CusTaxCode}</CusTaxCode>`;
      } else {
        xml += `<CusTaxCode></CusTaxCode>`;
      }
      xml += `<PaymentMethod>${obj.Kind_of_Payment}</PaymentMethod>`;
      xml += `<KindOfService>${obj.KindOfService}</KindOfService>`;

      if (this.vthem_extra) xml += `<Extra>${this.fkey_new}</Extra>`;
      xml += "<Products>";

      for (var i = 0; i < obj.Products.length; i++) {
        xml += "<Product>";
        xml += `<ProdName>${obj.Products[i].ProdName}</ProdName>`;
        xml += `<ProdUnit><${obj.Products[i].ProdUnit}</ProdUnit>`;
        xml += `<ProdQuantity>${obj.Products[i].ProdQuantity}</ProdQuantity>`;
        if (obj.Products[i].ProdPrice != null) {
          xml += `<ProdPrice>${Math.abs(
            Number(obj.Products[i].ProdPrice)
          )}</ProdPrice>`;
        } else {
          xml += `<ProdPrice>${obj.Products[i].ProdPrice}</ProdPrice>`;
        }

        if (obj.Products[i].Amount != null) {
          xml += `<Amount>${Math.abs(Number(obj.Products[i].Amount))}</Amount>`;
        } else {
          xml += `<Amount>${obj.Products[i].Amount}</Amount>`;
        }

        if (obj.Products[i].Amount != null) {
          xml += `<Total>${Math.abs(Number(obj.Products[i].Amount))}</Total>`;
        } else {
          xml += `<Total>${obj.Products[i].Amount}</Total>`;
        }

        if (obj.Products[i].VATRate != null) {
          xml += `<VATRate>${
            Number(obj.Products[i].VATRate)
          }</VATRate>`;
        } else {
          xml += `<VATRate>${obj.Products[i].VATRate}</VATRate>`;
        }

        if (obj.Products[i].VATAmount != null) {
          xml += `<VATAmount>${Math.abs(
            Number(obj.Products[i].VATAmount)
          )}</VATAmount>`;
        } else {
          xml += `<VATAmount>${obj.Products[i].VATAmount}</VATAmount>`;
        }

        xml += "</Product>";
      }

      xml += "</Products>";

      if (obj.Total != null) {
        xml += `<Total>${Math.abs(Number(obj.Total))}</Total>`;
      } else {
        xml += `<Total>${obj.Total}</Total>`;
      }

      xml += `<VATRate>${obj.VATRate}</VATRate>`;

      if (obj.VATAmount != null) {
        xml += `<VATAmount>${Math.abs(Number(obj.VATAmount))}</VATAmount>`;
      } else {
        xml += `<VATAmount>${obj.VATAmount}</VATAmount>`;
      }

      if (obj.Amount != null) {
        xml += `<Amount>${Math.abs(Number(obj.Amount))}</Amount>`;
      } else {
        xml += `<Amount>${obj.Amount}</Amount>`;
      }

      xml += `<AmountInWords>${this.txtTienVietBangChu}</AmountInWords>`;

      xml += `<GrossValue_NonTax>${Math.abs(
        Number(this.txtTongTienKhongThue)
      )}</GrossValue_NonTax>`;
      xml += `<GrossValue>${Math.abs(
        Number(this.txtTongTienKhongChiuThue)
      )}</GrossValue>`;
      xml += `<GrossValue0>${Math.abs(
        Number(this.txtTongTienChiuThue0)
      )}</GrossValue0>`;
      xml += "<VatAmount0>0</VatAmount0>";
      xml += `<GrossValue5>${Math.abs(
        Number(this.txtTongTienChiuThue5)
      )}</GrossValue5>`;
      xml += `<VatAmount5>${Math.abs(
        Number(this.txtTongTienThue5)
      )}</VatAmount5>`;
      xml += `<GrossValue10>${Math.abs(
        Number(this.txtTongTienChiuThue10)
      )}</GrossValue10>`;
      xml += `<VatAmount10>${Math.abs(
        Number(this.txtTongTienThue10)
      )}</VatAmount10>`;
      xml += `<Teller>${this.$root.token.getMaNhanVien()}</Teller>`;
      xml += "</ReplaceInv>";

      return xml;
    },

    GetInvoiceXml_Cus() {
      let xml = "<Customers><Customer>";
      xml += `<Name><![CDATA[${this.txtTenKhachHang?.trim()}]]></Name>`;
      xml += `<Code><![CDATA[${this.vma_gd?.trim()}]]></Code>`;
      xml += `<TaxCode><![CDATA[${this.txtMaSoThue}]]></TaxCode>`;
      xml += `<Address><![CDATA[${this.txtDiaChi}]]></Address>`;
      xml += "<BankAccountName></BankAccountName>";
      xml += "<BankName></BankName>";
      xml += "<BankNumber></BankNumber>";
      xml += `<Email><![CDATA[${this.txtEmail|| ""}]]></Email>`;
      xml += "<Fax></Fax>";
      xml += `<Phone><![CDATA[${this.txtSoDienThoai||""}]]></Phone>`;
      xml += "<ContactPerson></ContactPerson>";
      xml += "<RepresentPerson></RepresentPerson>";
      if (this.vloai_kh == "1" || this.txtMaSoThue == "")
        xml += "<CusType>0</CusType>";
      else xml += "<CusType>1</CusType>";
      xml += "</Customer></Customers>";
      return xml;
    },

    async Get_TTND() {
      const res = await api.thongtin_nguoidung2(this.axios, {});
      return res.data.data ? res.data.data : [];
    },

    async convertForVerifyFkey(fkey) {
      const res = await api.convertForVerifyFkey(this.axios, {
        fkey: fkey,
      });
      let kq = res.data;
      return kq;
    },

    async ChuyenDoi_XacMinh() {
      let kq = await this.convertForVerifyFkey(this.Fkey);
      if (kq.data == null) {
        this.$toast.error(kq.faultString);
        return false;
      } else {
        //gọi form hiệu chỉnh HDDT frmHieuChinh_HoaDon_DienTU
        this.html = kq.data;
        this.$refs.popupHieuChinhHDDTRef.showModal();
      }
    },

    async convertForStore(invToken) {
      const res = await api.convertForStore(this.axios, {
        invToken: invToken,
      });
      let kq = res.data;
      return kq;
    },

    async convertForStoreFkey(fkey) {
      const res = await api.convertForStoreFkey(this.axios, {
        fkey: fkey,
      });
      let kq = res.data;
      return kq;
    },

    async ChuyenDoi_LuuTru() {
      let kq = await this.convertForStore(this.invToken);
      if (kq.data == null) {
        this.$toast.error(kq.faultString);
        return false;
      } else {
        //gọi form hiệu chỉnh HDDT frmHieuChinh_HoaDon_DienTU
        this.html = kq.data;
        this.$refs.popupHieuChinhHDDTRef.showModal();
      }
    },

    async unConfirmPaymentFkey(lstFkey) {
      let tt_nd = await this.Get_TTND();
      const res = await api.unConfirmPaymentFkey(this.axios, {
        acPass: tt_nd.pass_hddt,
        account: tt_nd.user_hddt,
        lstFkey: lstFkey,
      });

      let kq = res.data.data ? res.data.data : null;
      if (kq == null) {
        kq = res.data.faultString;
      }
      return kq;
    },

    async Huy_GachNo() {
      try{
        let kq = await this.unConfirmPaymentFkey(this.Fkey);
        if (kq.substring(0, 2) != "OK") return `Lỗi hủy thanh toán HĐĐT !`
      
        await this.TaoDuLieuBD(this.objHoaDonDienTu, this.objHoaDonDienTuEdit, 0);
        await this.TaoDuLieuBDCT();
        this.clearTempKey();
        return 'OK'
      }catch(err){
        return `Lỗi hủy thanh toán HĐĐT ! ${err}`
      }

    },

    async ConfirmPaymentFkey(fKey, pattern, serial) {
      const res = await api.ConfirmPaymentFkey(this.axios, {
        fKey: fKey,
        pattern: pattern,
        serial: serial,
      });
      let kq = res.data.errorCode ? res.data.errorCode : res.data.faultString;
      if (kq != 0) {
        return res.data.faultString;
      } else {
        return 0;
      }
    },

    async ConfirmPaymentFkey_VTT(fKey, pattern, serial) {
      const res = await api.ConfirmPaymentFkey_VTT(this.axios, {
        fKey: fKey,
        pattern: pattern,
        serial: serial,
      });
      const kq = res.data.errorCode != 0 ? res.data.errorCode : 0;
      if (kq != 0) {
        return res.data.faultString;
      } else {
        return 0;
      }
    },



    async sp_capnhat_phieutt_hd_v3(
      p_hddt_fkey,
      p_loaihoadon_id,
      p_seri_id,
      p_seri,
      p_soseri,
      p_phieutt_id,
      p_nhanvien_id,
      p_donvi_id,
      p_kq
    ) {
      const res = await api.sp_capnhat_phieutt_hd_v3(this.axios, {
        p_hddt_fkey: p_hddt_fkey,
        p_loaihoadon_id: p_loaihoadon_id,
        p_seri_id: p_seri_id,
        p_seri: p_seri,
        p_soseri: p_soseri,
        p_phieutt_id: p_phieutt_id,
        p_nhanvien_id: p_nhanvien_id,
        p_donvi_id: p_donvi_id,
        p_kq: p_kq,
      });
      let kq = res.data.error_code ? res.data.error_code : res.data.message;

      if (kq != "BSS-00000000") {
        return res.data.message;
      } else {
        return 1;
      }
    },

    async GachNo() {
 
      // let sohoadon = "";
      if (this.ddlMauSo == 0)  return "Lỗi: Bạn chưa chọn mẫu số !"
        

      if (this.ddlKyHieu == 0) return "Lỗi: Bạn chưa chọn ký hiệu !";

      let kq = await this.ConfirmPaymentFkey(this.Fkey, "", "");
 
      if (kq != 0)  return `Lỗi thanh toán HĐĐT: ${kq}`;
       
      try {
          await this.TaoDuLieuBD(this.objHoaDonDienTu, this.objHoaDonDienTuEdit, 0);
          await this.TaoDuLieuBDCT();
      
          const paramsGachNo ={
            thaotac: this.vthaotac,
            js_bd_hddt: this.dsBDHDDT,
            js_bd_hddt_ct: this.dsBDHDDTCT,
            phieutt_id: this.vphieutt_id,
          }
          let response = await this.xuatHDDT_CapNhat(paramsGachNo);

          if (response.ERROR_CODE == 1) {
            this.button.capnhat = true;
            this.clearTempKey();
            return 'OK'
          }
          return `Xảy ra lỗi trong quá trình thanh toán hóa đơn !`;
        
      
        }catch(err){
        conlole.log(err)
        return `Lỗi: ${err}`;
    
      }

     
    },

    async AdjustInvoiceAction_TT78(
      acPass,
      account,
      attachFile,
      fkey,
      pattern,
      serial,
      xmlInvData
    ) {
      const res = await api.adjustInvoiceAction_tt78(this.axios, {
        acPass: acPass,
        account: account,
        attachFile: attachFile,
        convert: 0,
        fkey: fkey,
        pattern: pattern,
        serial: serial,
        xmlInvData: xmlInvData,
      });
      let kq = res.data.data ? res.data.data : null;

      if (kq == null) {
        kq = res.data.faultString;
      }
      return kq;
    },

    async adjustInv_V2(acPass, account, fkey, xmlInvData) {
      const res = await api.adjustInvoiceAction_v2(this.axios, {
        acPass: acPass,
        account: account,
        convert: 0,
        fkey: fkey,
        xmlInvData: xmlInvData,
      });
      let kq = res.data.data ? res.data.data : "";
      return kq;
    },

    async ReplaceInvoiceAction_TT78(
      acPass,
      account,
      attachFile,
      fkey,
      pattern,
      serial,
      xmlInvData
    ) {
      const res = await api.replaceInvoiceAction(this.axios, {
        acPass: acPass,
        account: account,
        attachFile: attachFile,
        convert: 0,
        fkey: fkey,
        pattern: pattern,
        serial: serial,
        xmlInvData: xmlInvData,
      });
      let kq = res.data.data ? res.data.data : "";
      return kq;
    },

    async DieuChinhHoaDon() {

      try {

        // let sohoadon = "";
        if (this.ddlMauSo == 0)  return "Lỗi: Bạn chưa chọn mẫu số !"
        
        let pattern = this.getPattern();

        if (this.ddlKyHieu == 0) return "Lỗi: Bạn chưa chọn ký hiệu !";

        let seri = this.getSeri();
       

        // let pro = this.Product;
        let ar_pro = [];

        let tong_Total = 0;
        let tong_Amount = 0;
        let tong_VAT_Amount = 0;
        //Bind lại objHoaDonDienTuEdit
        for (var i = 0; i < this.grid_danhsach.length; i++) {
          if (this.grid_danhsach[i].ProdName) {
            tong_Total = tong_Total + Number(this.grid_danhsach[i].Total);
            tong_Amount = tong_Amount + Number(this.grid_danhsach[i].Amount);
            tong_VAT_Amount =
              tong_VAT_Amount + Number(this.grid_danhsach[i].VATAmount);
            ar_pro.push({
              Code: this.grid_danhsach[i].Code,
              Total: this.grid_danhsach[i].Total,
              ProdName: this.grid_danhsach[i].ProdName,
              ProdUnit: this.grid_danhsach[i].ProdUnit,
              ProdQuantity: this.grid_danhsach[i].ProdQuantity,
              ProdPrice: this.grid_danhsach[i].ProdPrice,
              Discount: this.grid_danhsach[i].Discount,
              DiscountAmount: this.grid_danhsach[i].DiscountAmount,
              VATRate: this.grid_danhsach[i].VATRate,
              VATAmount: this.grid_danhsach[i].VATAmount,
              Amount: this.grid_danhsach[i].Amount,
            });
          }
        }
        this.objHoaDonDienTuEdit.Products = ar_pro;
        this.objHoaDonDienTuEdit.Total = tong_Total;
        this.objHoaDonDienTuEdit.VAT_Amount = tong_VAT_Amount;

        this.objHoaDonDienTuEdit.Amount = tong_Amount;

        await this.doi_so_sang_chu(Number(tong_Amount));
        
        this.objHoaDonDienTuEdit.Amount_words = this.txtTienVietBangChu;
 
       
        let tt_nd = await this.Get_TTND();
      

        let invoice_tt78 = await this.GetInvoiceXml_DieuChinh_tt78(this.objHoaDonDienTuEdit);
     
        let kq = await this.AdjustInvoiceAction_TT78(
          tt_nd.pass_hddt_td,
          tt_nd.user_hddt_td,
          "11",
          this.Fkey,
          pattern,
          seri,
          invoice_tt78
        );
        let result = kq.split(":");
        if(result[0] != "OK"){
          console.log(kq)
          return "Có lỗi trong quá trình điều chỉnh hóa đơn : " + kq
        }

        let InvoicePattern1 = "";
        let SerialNo1 = "";
        let InvoiceNo1 = "";

        let result1 = result[1].split(";");

        InvoicePattern1 = result1[0];
        this.objHoaDonDienTuEdit.InvoicePattern = result1[0];
        this.objHoaDonDienTuEdit.SerialNo = result1[1];
        let result3 = result1[2].split("_");
        this.objHoaDonDienTuEdit.InvoiceNo = result3[1];
        this.fkey_new = result3[0];

        await this.TaoDuLieuBD(this.objHoaDonDienTu, this.objHoaDonDienTuEdit, this.ddlKyHieu);
        await this.TaoDuLieuBDCT();

        for (var i = 0; i < this.options.mauso.length; i++) {
          if (this.options.mauso[i].text ==this.objHoaDonDienTuEdit.InvoicePattern) {
            this.ddlMauSo = this.options.mauso[i].id;
          }
        }

        for (var i = 0; i < this.options.kyhieu.length; i++) {
          if (this.options.kyhieu[i].text == this.objHoaDonDienTuEdit.SerialNo) {
            this.ddlKyHieu = this.options.kyhieu[i].id;
          }
        }
        this.txtSoHoaDon = this.objHoaDonDienTuEdit.InvoiceNo;

        const paramAdjustInvoiceAction = {
                        
          hddt_fkey:  this.fkey_new,
          js_bd_hddt:  this.dsBDHDDT,
          js_bd_hddt_ct:  this.dsBDHDDTCT,
          js_ds_thoai: this.ds_thoai,
          js_ds_hd_khachhang: this.dsHDKH,
          js_ds_hd_thuebao: this.dsHDTB,
          js_ds_hdtb_goi_dadv: this._dsGoi,
          invoice_action:"AdjustInvoiceAction_TT78",
          ketqua_capnhat:  result[0],
          // soseri:  InvoiceNo1, 
          thaydoi_doituong_visa: this.thaydoi_doituong_visa,
          doicongacccountvisa: this.doicongacccountvisa, 
          doitocdoadsl: this.doitocdoadsl,
          huonggiao_id: this.huonggiaotn_id,
          vasc_status: this.vasc_status, 
        }
      
        //xuat hoa don
        const resCapnhat = await this.xuatHDDT_CapNhat(paramAdjustInvoiceAction);
  
        if (resCapnhat.ERROR_CODE == 1) {
          this.clearTempKey();
          return "OK"
        }

        return 'Xảy ra lỗi trong quá trình điều chỉnh hóa đơn !'
          
        
      } catch (er) {
        console.log(er)
        return "Có lỗi trong quá trình điều chỉnh hóa đơn : " + er
      }
    },
    async DieuChinhHoaDon_VTT(){
      //todo
    },

    async ThayTheHoaDon() {

 
      try {
        let sohoadon = "";
        if (this.ddlMauSo == 0)  return "Lỗi: Bạn chưa chọn mẫu số !"
      
        if (this.ddlKyHieu == 0) return "Lỗi: Bạn chưa chọn ký hiệu !";

        let pattern = this.getPattern();
        let seri = this.getSeri();
        
        let pro = this.Product;

        let ar_pro = [];
        //Bind lại objHoaDonDienTuEdit
        for (var i = 0; i < this.grid_danhsach.length; i++) {
          if (this.grid_danhsach[i].ProdName != null) {
            ar_pro.push({
              Code: this.grid_danhsach[i].Code,
              Total: this.grid_danhsach[i].Total,
              ProdName: this.grid_danhsach[i].ProdName,
              ProdUnit: this.grid_danhsach[i].ProdUnit,
              ProdQuantity: this.grid_danhsach[i].ProdQuantity,
              ProdPrice: this.grid_danhsach[i].ProdPrice,
              Discount: this.grid_danhsach[i].Discount,
              DiscountAmount: this.grid_danhsach[i].DiscountAmount,
              VATRate: this.grid_danhsach[i].VATRate,
              VATAmount: this.grid_danhsach[i].VATAmount,
              Amount: this.grid_danhsach[i].Amount,
            });
          }
        }
        

        this.objHoaDonDienTuEdit.Products = ar_pro;
        let tt_nd = await this.Get_TTND();
        // let kq = "";
        let xml_thaythe = await this.GetInvoiceXml_ThayThe_tt78(this.objHoaDonDienTuEdit);

        let mauSo = this.options.mauso.find((item) => item.id == this.ddlMauSo).text;
        let kyHieu = this.options.kyhieu.find((item) => item.id == this.ddlKyHieu).text;
        console.log("this.Fkey", this.Fkey)
        
        const kq = await this.ReplaceInvoiceAction_TT78(
          tt_nd.pass_hddt_td,
          tt_nd.user_hddt_td,
          "11",
          this.Fkey,
          mauSo,
          kyHieu,
          xml_thaythe
        );

        let result = kq.split(":");
        if (result[0] == "OK") {
          let InvoicePattern1 = "";
          let SerialNo1 = "";
          let InvoiceNo1 = "";

          let result1 = result[1].split(";");
          InvoicePattern1 = result1[0];

          this.objHoaDonDienTuEdit.InvoicePattern = result1[0];
          this.objHoaDonDienTuEdit.SerialNo = result1[1];

          let result3 = result1[2].split("_");
          this.objHoaDonDienTuEdit.InvoiceNo = result3[1];

          this.fkey_new = result3[0];

          await this.TaoDuLieuBD(
            this.objHoaDonDienTu,
            this.objHoaDonDienTuEdit,
            this.ddlKyHieu
          );
          await this.TaoDuLieuBDCT();

          this.ddlMauSo = InvoicePattern1;
          this.ddlKyHieu = SerialNo1;
          this.txtSoHoaDon = InvoiceNo1;

          for (var i = 0; i < this.options.mauso.length; i++) {
            if (
              this.options.mauso[i].text ==
              this.objHoaDonDienTuEdit.InvoicePattern
            ) {
              this.ddlMauSo = this.options.mauso[i].id;
            }
          }
          for (var i = 0; i < this.options.kyhieu.length; i++) {
            if (
              this.options.kyhieu[i].text == this.objHoaDonDienTuEdit.SerialNo
            ) {
              this.ddlKyHieu = this.options.kyhieu[i].id;
            }
          }
          this.txtSoHoaDon = this.objHoaDonDienTuEdit.InvoiceNo;
          this.clearTempKey();

          return 'OK'
        } else {
          console.log(kq)
          return `Có lỗi trong quá trình thay thế hóa đơn: ${kq}`
        }
      } catch (err) {
        console.log(err)
        return `Có lỗi trong quá trình thay thế hóa đơn: ${err}`

      }
    },
    clearTempKey(){
      this.invToken = "";
      this.fkey_new = "";
      this.Fkey = "";
      this.count = 0;
    },

    async cancelInv(acPass, account, fkey) {
      const res = await api.cancelInv(this.axios, {
        acPass: acPass,
        account: account,
        fkey: fkey,
      });
      let kq = res.data.data ? res.data.data : null;
      if (kq == null) {
        kq = res.data.faultString;
      }
      return kq;
    },


    async HuyThanhToan_HuyHoaDon() {
  
      try {
        if (this.vpayment == 1) {
          let kq2 = await this.unConfirmPaymentFkey(this.Fkey);
          if (kq2.substring(0, 2) != "OK") return `Có lỗi trong quá trình hủy hóa đơn: ${kq2}`
           
        }
       
        let tt_nd = await this.Get_TTND();

        let kq = await this.cancelInv(
          tt_nd.pass_hddt_td,
          tt_nd.user_hddt_td,
          this.Fkey
        );

        let result = kq.split(":");
        if (result[0] == "OK") {
          await this.TaoDuLieuBD(
            this.objHoaDonDienTu,
            this.objHoaDonDienTuEdit,
            0
          );
          await this.TaoDuLieuBDCT();

        
          const paramCancelInv ={
            hddt_fkey: this.Fkey,
            js_bd_hddt: this.dsBDHDDT,
            js_bd_hddt_ct: this.dsBDHDDTCT,
            js_ds_thoai: this.ds_thoai,
            js_ds_hd_khachhang: this.dsHDKH,
            js_ds_hd_thuebao: this.dsHDTB,
            js_ds_hdtb_goi_dadv: this._dsGoi,
            ketqua_capnhat: result[0],
            invoice_action: "cancelInv",
            ketqua_capnhat : "OK", 
          }

          let resCapnhat = await this.xuatHDDT_CapNhat(paramCancelInv);
          if (resCapnhat.ERROR_CODE == 1) return "OK";

          return `Xảy ra lỗi trong quá trình hủy hóa đơn !`
          
        } else {
          return `Xảy ra lỗi trong quá trình hủy hóa đơn ! ${kq}`
        }
      } catch (err) {
        console.log(err);
        return `Xảy ra lỗi trong quá trình hủy hóa đơn ! ${err}`
      }
    },

    async HuyThanhToan_HuyHoaDon_v2() {
      try {

        let tt_nd = await this.Get_TTND();
        let ds_bd = this.kq_capnhat.DS_BD;
        let kq1 = "";
        let kq2 = "";
        if (ds_bd.length > 0) {
          for (var i = 0; i < ds_bd.length; i++) {

            kq1 = await this.unConfirmPaymentFkey(this.Fkey);

            if (kq1.substring(0, 2) != "OK")   return `Lỗi hủy thanh toán HĐĐT: ${kq1}`
             
            await this.TraCuu(
              ds_bd[i].FKEY,
              ds_bd[i].SERI_MOI,
              ds_bd[i].SO_HD_MOI
            );

            let kq = await this.cancelInv(
              tt_nd.pass_hddt_td,
              tt_nd.user_hddt_td,
              this.Fkey
            );
            let result = kq.split(":");
            kq2 = result[0];
            if (result[0] == "OK") {

              await this.TaoDuLieuBD( this.objHoaDonDienTu,this.objHoaDonDienTuEdit,0);
              await this.TaoDuLieuBDCT();

            } else {
              kq2 = kq;
              return `Có lỗi trong quá trình hủy hóa đơn: ${kq}`
            }
          }

          if (kq1.substring(0, 2) != "OK" && kq2 == "OK") {

            const paramsCanelHDDT ={
              hddt_fkey: this.Fkey,
              js_bd_hddt: this.dsBDHDDT,
              js_bd_hddt_ct: this.dsBDHDDTCT,
              js_ds_thoai: this.ds_thoai,
              js_ds_hd_khachhang: this.dsHDKH,
              js_ds_hd_thuebao: this.dsHDTB,
              js_ds_hdtb_goi_dadv: this._dsGoi,
              ketqua_capnhat: result[0],
              invoice_action: "cancelInv",
              ketqua_capnhat : "OK",
            }
            let resCapnhat = await this.xuatHDDT_CapNhat(paramsCanelHDDT);
            if (resCapnhat.ERROR_CODE == 1) {
              return `OK`
            } else {
              return `Có lỗi trong quá trình hủy hóa đơn`
            }
          }
        }
      } catch (e) {
        return `Có lỗi trong quá trình hủy hóa đơn: ${e}`
      }
    },


    async ChuyenDoi_LuuTru_VTT() {
      let kq = await this.convertForStoreFkey(this.Fkey);
      if (kq.data == null) {
        this.$toast.error(kq.faultString);
        return false;
      } else {
        //gọi form hiệu chỉnh HDDT frmHieuChinh_HoaDon_DienTU
        this.html = kq.data;
        this.$refs.popupHieuChinhHDDTRef.showModal();
      }
    },
  
    async Xuathoadon_GachNo() {

      try {
        let tt_nd = await this.Get_TTND();
        // let sohoadon = "";
        if (this.ddlMauSo == 0)  return "Lỗi: Bạn chưa chọn mẫu số !"
        
        let pattern = this.getPattern(this.ddlMauSo);

        if (this.ddlKyHieu == 0) return "Lỗi: Bạn chưa chọn ký hiệu !";

        let seri = this.getSeri();

        const resultUpdateCus = await this.UpdateCus(this.GetInvoiceXml_Cus());

        if (resultUpdateCus != 1) return `Có lỗi trong quá trình cập nhật thông tin khách hàng ${resultUpdateCus}`
  
        let invoice_tt78 = await this.GetInvoiceXml_tt78();
        let kq = await this.ImportAndPublishInv( tt_nd.user_hddt_td, tt_nd.pass_hddt_td, invoice_tt78, pattern, seri );
        let result = kq.split(":");
        if(result[0] != "OK") {
          return `Lỗi: ${kq}`;
        }

        let result1 = result[1].split(";");
        let InvoicePattern1 = result1[0];
        this.objHoaDonDienTuEdit.InvoicePattern = InvoicePattern1;
        let result2 = result1[1].split("-");
        let SerialNo1 = result2[0];
        this.objHoaDonDienTuEdit.SerialNo = SerialNo1;
        let result3 = result2[1].split("_");
        let InvoiceNo1 = result3[1];
        this.objHoaDonDienTuEdit.InvoiceNo = InvoiceNo1;

        for (var i = 0; i < this.options.mauso.length; i++) {

          if ( this.options.mauso[i].text == this.objHoaDonDienTuEdit.InvoicePattern) {
            this.ddlMauSo = this.options.mauso[i].id;
          }
        }

        for (var i = 0; i < this.options.kyhieu.length; i++) {
          if (this.options.kyhieu[i].text == this.objHoaDonDienTuEdit.SerialNo) {
            this.ddlKyHieu = this.options.kyhieu[i].id;
          }
        }

        this.txtSoHoaDon = InvoiceNo1;
        this.lblMauSo = InvoicePattern1;
        this.lblKyHieu = SerialNo1;
        this.lblSo_No = InvoiceNo1;

        //tạo dữ liệu biến động
        await this.TaoDuLieuBD_v2(SerialNo1, InvoiceNo1, this.ddlKyHieu, 0);
        await this.TaoDuLieuBDCT();

        //a Van báo fix chuyển lên trước ConfirmPaymentFkey: fix chỗ ko lưu biến động số dư 8/11/2023
        const paramsXuatHoaDon = {
          //thuoc tinh rieng
          hddt_fkey:  this.Fkey,
          js_bd_hddt:  this.dsBDHDDT,
          js_bd_hddt_ct:  this.dsBDHDDTCT,
          js_ds_thoai: this.ds_thoai,
          js_ds_hd_khachhang: this.dsHDKH,
          js_ds_hd_thuebao: this.dsHDTB,
          js_ds_hdtb_goi_dadv: this._dsGoi,
          invoice_action:"ImportAndPublishInv_V2",
          ketqua_capnhat:  result[0],
          soseri:  InvoiceNo1,
          thaydoi_doituong_visa: this.thaydoi_doituong_visa,
          doicongacccountvisa: this.doicongacccountvisa, 
          doitocdoadsl: this.doitocdoadsl,
          huonggiao_id: this.huonggiaotn_id,
          vasc_status: this.vasc_status,

        }

        let resXuatHDDT = await this.xuatHDDT_CapNhat(paramsXuatHoaDon);

        
        if (resXuatHDDT.ERROR_CODE != 1) 
          return `Xảy ra lỗi trong quá trình xuất hóa đơn và thanh toán !`


        let kq2 = await this.ConfirmPaymentFkey(this.Fkey, "", "");
        if (kq2 != 0) return `Lỗi thanh toán HĐĐT !  + ${kq2}`
          
        let kq_capnhat = await this.sp_capnhat_phieutt_hd_v3(
          this.Fkey,
          this.ddlMauSo,
          this.ddlKyHieu,
          SerialNo1,
          InvoiceNo1,
          this.vphieutt_id,
          this.$root.token.getNhanVienID(),
          this.$root.token.getDonViID(),
          kq2 );

        if (kq_capnhat != 1)  return `Lỗi:  + ${kq_capnhat}`
        

        await this.TraCuu(InvoicePattern1, SerialNo1, InvoiceNo1);
          
        this.clearTempKey();
        return `OK` //Xuất hóa đơn và thanh toán thành công!
        
        
      } catch (e) {
        console.log(e)
        return `Xảy ra lỗi trong quá trình xuất hóa đơn và thanh toán ! ${e}`
      }
    },

    async Xuathoadon_GachNo_VTT()
     {
         try
         {
            let tt_nd = await this.Get_TTND();
            if (this.ddlMauSo == 0)  return "Lỗi: Bạn chưa chọn mẫu số !"
        
            let pattern = this.getPattern(this.ddlMauSo);

            if (this.ddlKyHieu == 0) return "Lỗi: Bạn chưa chọn ký hiệu !";

            let seri = this.getSeri();
             
            // let sohoadon = ""
            
             let resultUpdateCusVTT = await this.UpdateCus_VTT(this.GetInvoiceXml_Cus());
     
             if (resultUpdateCusVTT != 1)  return `Có lỗi trong quá trình cập nhật thông tin khách hàng `
             

             const xmlInvData78 = await this.GetInvoiceXml_tt78()
 
             const kq = await this.ImportAndPublishInv_VTT(tt_nd.user_hddt_td, tt_nd.pass_hddt_td, xmlInvData78, pattern, seri);
            
             let result = kq.split(':');
         
             if (result[0] == "OK")
             {
           
                 let result1 = result[1].split(';');
                 let InvoicePattern1 = result1[0]
                 this.objHoaDonDienTuEdit.InvoicePattern = InvoicePattern1;
                 let result2 = result1[1].split('-');
                 let SerialNo1 = result2[0]
                 this.objHoaDonDienTuEdit.SerialNo = SerialNo1;
                 let result3 = result2[1].split('_');
                 let InvoiceNo1 = result3[1]
                 this.objHoaDonDienTuEdit.InvoiceNo = InvoiceNo1;

                 for(var i=0; i < this.options.mauso.length;i++)
                 {
                     if(this.options.mauso[i].text == this.objHoaDonDienTuEdit.InvoicePattern)
                     {
                         this.ddlMauSo = this.options.mauso[i].id
                     }
                 }
                 for(var i=0; i < this.options.mauso.length;i++)
                 {
                     if(this.options.kyhieu[i].text ==this.objHoaDonDienTuEdit.SerialNo)
                     {
                         this.ddlKyHieu = this.options.kyhieu[i].id
                     }
                 }
                 this.txtSoHoaDon = InvoiceNo1

                 this.lblMauSo = InvoicePattern1
                 this.lblKyHieu = SerialNo1
                 this.lblSo_No = InvoiceNo1

                 let loi_thanhtoan = 0;

                 let kq2 = "";
                 try
                 {
                     kq2 = await this.ConfirmPaymentFkey_VTT(this.Fkey,"","")
                     if(kq2 != 0)
                     {
                         loi_thanhtoan = 1
                         return `Lỗi thanh toán HĐĐT !: ${kq2}`
                     }

                 }
                 catch(e)
                 {
                     loi_thanhtoan = 1
                     return `Lỗi : ${e}`
                 }

                 try { 
                    await this.TraCuu(InvoicePattern1, SerialNo1, InvoiceNo1); 
                    await this.TaoDuLieuBD_v2(SerialNo1, InvoiceNo1, this.ddlKyHieu, loi_thanhtoan);
                    await this.TaoDuLieuBDCT();
                  }
                 catch(e)
                 {
                  console.log(e)
                  return `Lỗi : ${e}`
                 }
               
         
                  const paramImportAndPublishInvV2 = {
                        
                    hddt_fkey:  this.Fkey,
                    js_bd_hddt:  this.dsBDHDDT,
                    js_bd_hddt_ct:  this.dsBDHDDTCT,
                    js_ds_thoai: this.ds_thoai,
                    js_ds_hd_khachhang: this.dsHDKH,
                    js_ds_hd_thuebao: this.dsHDTB,
                    js_ds_hdtb_goi_dadv: this._dsGoi,
                    invoice_action:"ImportAndPublishInv_V2",
                    ketqua_capnhat:  result[0],
                    soseri:  InvoiceNo1,
                    thaydoi_doituong_visa: this.thaydoi_doituong_visa,
                    doicongacccountvisa: this.doicongacccountvisa, 
                    doitocdoadsl: this.doitocdoadsl,
                    huonggiao_id: this.huonggiaotn_id,
                    vasc_status: this.vasc_status,

                  }

                  let abc = await this.xuatHDDT_CapNhat(paramImportAndPublishInvV2);

                  if (abc.ERROR_CODE == 1) {
                    this.clearTempKey();
                    return `OK`
                    // this.$toast.success("Xuất hóa đơn và thanh toán thành công!");
                  } else {
                    return `Xảy ra lỗi trong quá trình xuất hóa đơn !`
                  }
             }
             else
             {
                return `Xảy ra lỗi trong quá trình xuất hóa đơn: ${kq}`

             }
         }
         catch(e)
         {
          console.log(e);
          return `Xảy ra lỗi trong quá trình xuất hóa đơn: ${e}`
         }

    },

    getPattern(){
      let pattern = ""; 
      for (var i = 0; i < this.options.mauso.length; i++) {
          if (this.options.mauso[i].id == this.ddlMauSo) {
            pattern = this.options.mauso[i].text;
          }
      }
      return pattern;
    },

    getSeri(){
      let seri = '';
      for (var i = 0; i < this.options.kyhieu.length; i++) {
        if (this.options.kyhieu[i].id == this.ddlKyHieu) {
          seri = this.options.kyhieu[i].text;
        }
      }
      return seri
    },

   async ThayTheHoaDon_VTT() {
      try {

        let sohoadon = "";
        if (this.ddlMauSo == 0)  return "Lỗi: Bạn chưa chọn mẫu số !"
        
        if (this.ddlKyHieu == 0) return "Lỗi: Bạn chưa chọn ký hiệu !";

        let pattern = this.ddlMauSo;
        let seri = this.ddlKyHieu;
        let pro = this.Product;
        let ar_pro = [];

        //Bind lại objHoaDonDienTuEdit
        for (var i = 0; i < this.grid_danhsach.length; i++) {
          if (this.grid_danhsach[i].ProdName != null) {
            ar_pro.push({
              Code: grid_danhsach[i].Code,
              Total: grid_danhsach[i].Total,
              ProdName: grid_danhsach[i].ProdName,
              ProdUnit: grid_danhsach[i].ProdUnit,
              ProdQuantity: grid_danhsach[i].ProdQuantity,
              ProdPrice: grid_danhsach[i].ProdPrice,
              Discount: grid_danhsach[i].Discount,
              DiscountAmount: grid_danhsach[i].DiscountAmount,
              VATRate: grid_danhsach[i].VATRate,
              VATAmount: grid_danhsach[i].VATAmount,
              Amount: grid_danhsach[i].Amount,
            });
          }
        }

        this.objHoaDonDienTuEdit.Products = ar_pro;
        let tt_nd = await this.Get_TTND();
        const xmlInvData78 = await this.GetInvoiceXml_ThayThe_tt78(this.objHoaDonDienTuEdit);
        let kq = await this.ReplaceInvoiceAction_TT78(
          tt_nd.pass_hddt_td,
          tt_nd.user_hddt_td,"11",
          this.Fkey,
          "",
          "",
          xmlInvData78
        );

        let result = kq.split(":");
        if (result[0] == "OK") {
          let InvoicePattern1 = "";
          let SerialNo1 = "";
          let InvoiceNo1 = "";

          let result1 = result[1].split(";");
          InvoicePattern1 = result1[0];

          this.objHoaDonDienTuEdit.InvoicePattern = result1[0];
          this.objHoaDonDienTuEdit.SerialNo = result1[1];

          let result3 = result1[2].split("_");
          this.objHoaDonDienTuEdit.InvoiceNo = result3[1];

          this.fkey_new = result3[0];

         await this.TaoDuLieuBD(
            this.objHoaDonDienTu,
            this.objHoaDonDienTuEdit,
            this.ddlKyHieu
          );
          await this.TaoDuLieuBDCT();

          this.ddlMauSo = InvoicePattern1;
          this.ddlKyHieu = SerialNo1;
          this.txtSoHoaDon = InvoiceNo1;
          for (var i = 0; i < this.options.mauso.length; i++) {
            if (
              this.options.mauso[i].text == this.objHoaDonDienTuEdit.InvoicePattern
            ) {
              this.ddlMauSo = this.options.mauso[i].id;
            }
          }
          for (var i = 0; i < this.options.mauso.length; i++) {
            if (
              this.options.kyhieu[i].text == this.objHoaDonDienTuEdit.SerialNo
            ) {
              this.ddlKyHieu = this.options.kyhieu[i].id;
            }
          }
          this.txtSoHoaDon = this.objHoaDonDienTuEdit.InvoiceNo;

          this.clearTempKey();
          return "OK";
        } else {
          console.log(kq)
          return "Có lỗi trong quá trình điều chỉnh hóa đơn: " + kq;
         
        }
      } catch (err) {
        console.log(err)
        return "Có lỗi trong quá trình điều chỉnh hóa đơn: " + err;
      }
    },

   async HuyHoaDon_VTT() {
      try {
        let tt_nd = await this.Get_TTND();

        let kq = this.cancelInv(
          tt_nd.pass_hddt_td,
          tt_nd.user_hddt_td,
          "11",
          this.Fkey,
          pattern,
          seri,
          await this.GetInvoiceXml_DieuChinh_tt78(this.objHoaDonDienTuEdit)
        );

        let result = kq.split(":");
        if (result[0] == "OK") {
          await this.TaoDuLieuBD(this.objHoaDonDienTu, this.objHoaDonDienTuEdit, 0);
          await this.TaoDuLieuBDCT();
          this.clearTempKey();
          return "OK"
        } 
        return `Có lỗi trong quá trình hủy hóa đơn:  ${kq}` 
      } catch (e) {
         console.log(e)
        return `Có lỗi:  ${e}` 
      }
    },

    async HuyHoaDon() {
      try {
        let tt_nd = await this.Get_TTND();

        const xmlDieuChinh_tt78 = await this.GetInvoiceXml_DieuChinh_tt78(this.objHoaDonDienTuEdit)
        
        let kq = await this.cancelInv( tt_nd.pass_hddt_td,tt_nd.user_hddt_td, "11", this.Fkey,pattern, seri, xmlDieuChinh_tt78);

        let result = kq.split(":");
        if (result[0] == "OK") {
          let InvoicePattern1 = "";
          let SerialNo1 = "";
          let InvoiceNo1 = "";

          let result1 = result[1].split(";");

          InvoicePattern1 = result1[0];
          this.objHoaDonDienTuEdit.InvoicePattern = result1[0];
          this.objHoaDonDienTuEdit.SerialNo = result1[1];
          let result3 = result1[2].split("_");
          this.objHoaDonDienTuEdit.InvoiceNo = result3[1];
          this.fkey_new = result3[0];

          await this.TaoDuLieuBD(
            this.objHoaDonDienTu,
            this.objHoaDonDienTuEdit,
            this.ddlKyHieu
          );
          await this.TaoDuLieuBDCT();

          this.ddlMauSo = InvoicePattern1;
          this.ddlKyHieu = SerialNo1;
          this.txtSoHoaDon = InvoiceNo1;

          for (var i = 0; i < this.options.mauso.length; i++) {
            if ( this.options.mauso[i].text == this.objHoaDonDienTuEdit.InvoicePattern) {
              this.ddlMauSo = this.options.mauso[i].id;
            }
          }

          for (var i = 0; i < this.options.kyhieu.length; i++) {
            if ( this.options.kyhieu[i].text == this.objHoaDonDienTuEdit.SerialNo) {
              this.ddlKyHieu = this.options.kyhieu[i].id;
            }
          }

          this.txtSoHoaDon = this.objHoaDonDienTuEdit.InvoiceNo;
          this.clearTempKey();
          return 'OK'
        } else {
          return "Có lỗi trong quá trình hủy hóa đơn: " + kq
        }
      } catch (er) {
        console.log(er)
        return "Có lỗi: " + er
      }
    },


    async HuyThanhToan_HuyHoaDon_VTT() {
      try {
        let tt_nd = await this.Get_TTND();
        let kq2 = "";
        let ds_bd = this.kq_capnhat.DS_BD;

        if (ds_bd.length > 0) {
          for (var i = 0; i < ds_bd.length; i++) {
            kq2 = await this.unConfirmPaymentFkey(this.Fkey);
            if (kq2 != 0) 
              return `Lỗi hủy thanh toán HĐĐT !`
            
            let kq = await this.cancelInv(
              tt_nd.pass_hddt_td,
              tt_nd.user_hddt_td,
              this.Fkey
            );
            let result = kq.split(":");
            kq2 = result[0];
            if (result[0] == "OK") {
              await this.TaoDuLieuBD(this.objHoaDonDienTu, this.objHoaDonDienTuEdit, 0);
              await this.TaoDuLieuBDCT();

      
          
              const paramsCanInv = {
             
                js_bd_hddt : this.dsBDHDDT,
                js_bd_hddt_ct :this.dsBDHDDTCT,
                ketqua_capnhat :result[0],
                invoice_action :"cancelInv",
                hddt_fkey :this.Fkey,
                phieutt_id :this.vphieutt_id,
                js_ds_thoai :this.ds_thoai,
                thaydoi_doituong_visa :this.thaydoi_doituong_visa,
                doicongacccountvisa :this.doicongacccountvisa,
                doitocdoadsl :this.doitocdoadsl,
                js_ds_hd_khachhang :this.dsHDKH,
                js_ds_hd_thuebao :this.dsHDTB,
                js_ds_hdtb_goi_dadv :this._dsGoi,
                huonggiao_id :this.huonggiaotn_id,
                
                vasc_status :this.vasc_status,
                tien_thoaitra : this.t_tien_thoaitra,
                tien_edited :this.t_tien_edited,
                ketqua_capnhat : "OK",
 
                
              }

              let resCapNhat = await this.xuatHDDT_CapNhat(paramsCanInv);
              if (resCapNhat.ERROR_CODE == 1) 
                return 'OK'
              return 'Xảy ra lỗi trong quá trình hủy hóa đơn !'
              
            } else {
              return `Có lỗi trong quá trình hủy hóa đơn: ${kq}`
            }
          }
        }
      } catch (e) {
        return `Có lỗi: ${e}`
      }
    },

    async getmatocdo(hdtb_id) {
      let ar_js = {
        hdtb_id
      };
      const res = await api.getmatocdo(this.axios, {
        p_ds_para: JSON.stringify(ar_js),
      });
      let kq = res.data.data ? res.data.data : "";
      return kq;
    },

    async TraCuuThueBao(array) {
      const res = await api.TraCuuThueBao(this.axios, { accountName: array});
      let kq = res.data.data ? res.data.data : [];
      return kq;
    },

    async removeVNN(array, chuthich) {
      const res = await api.removeVNN(this.axios, {
        accountModel: array,
        note: "0",
        reason: chuthich,
      });
      let kq = res.data.data ? res.data.data : [];
      return kq;
    },

    async GetSubscriberInfo(array) {
      const res = await api.GetSubscriberInfo(this.axios, {
        accountModel: array,
      });
      let kq = res.data.data ? res.data.data : [];
      return kq;
    },

    async CancelSubscriberV2(array) {
      const res = await api.CancelSubscriberV2(this.axios, {
        accountModel: array,
        note: 30,
      });
      let kq = res.data.data ? res.data.data : [];
      return kq;
    },
    
    async DeleteMyTV(array) {
      const res = await api.DeleteMyTV(this.axios, {
        accountModel: array,
      });
      let kq = res.data.data ? res.data.data : [];
      return kq;
    },

    async ThayDoi_DoiTuong_Visa(accountName, customerType) {
      let ar_js = {
        accountName: accountName,
        customerType: customerType,
      };
      let note = moment(new Date()).format("DD/MM/YYYY");
      const res = await api.ChangeCustomerType(this.axios, {
        customerModel: JSON.stringify(ar_js),
        note: "Thay doi loai khach hang qua WS ngay: " + note,
      });
      let kq = res.data.data ? res.data.data : 0;
      return kq;
    },

    async Thoai_Tra() {
      try {

        if (this.i_thoaitra_tmp == 1) {
          // có thoái trả tmp
          for (var i = 0; i < this.ds_thoai.length; i++) {

            const itemThoaiTra = this.ds_thoai[i];

            let kt_thoaitra = false; // Kiem tra da reset port chua
            let h_hdkh_id = itemThoaiTra.HDKH_ID;
            let h_loaitb_id = itemThoaiTra.LOAITB_ID;
            let h_dichvuvt_id = itemThoaiTra.DICHVUVT_ID;
            let h_loaihd_id = itemThoaiTra.LOAIHD_ID;
            let h_ma_tb = itemThoaiTra.MA_TB;
            let h_thuebao_id = 0;

            if (itemThoaiTra.THUEBAO_ID != null) {
              h_thuebao_id = itemThoaiTra.THUEBAO_ID;
            }

            let h_hdtb_id = itemThoaiTra.HDTB_ID;
            let h_tt_dongbo = itemThoaiTra.STATUS;

            if (h_tt_dongbo) {
              if (h_tt_dongbo == 5 && h_loaihd_id != 1 && h_loaihd_id != 6) {
                this.$toast.error( "Thuê bao đã ở trạng thái kích hoạt.\nBạn không thể thực hiện thoái trả cho thuê bao này !");
                return false;
              }
            }

            if(itemThoaiTra.hddt_status  == '-9994') kt_thoaitra = true;
      
            if(!kt_thoaitra){
              // const resultThoaiTra = await this.THOAITRA_THANHTOAN({kt_thoaitra, h_loaitb_id})

              let checkResultThoaiTra = true;
              // Thoái trả Internet
              if(h_dichvuvt_id ==  DichVuVienThong.ADSL){
        
                checkResultThoaiTra=  await this.handleCheckThoaiTra_Internet({ h_loaitb_id,  h_loaihd_id, h_tt_dongbo, h_ma_tb })
         
              }
              // Thoái trả IMS
              if(h_dichvuvt_id == DichVuVienThong.IMS){
       
                checkResultThoaiTra = await this.handleCheckThoaiTra_IMS({h_tt_dongbo, h_loaitb_id})

              }
              // Thoái trả Cố định
              if(h_dichvuvt_id == DichVuVienThong.CO_DINH){
                checkResultThoaiTra = await this.handleCheckThoaiTra_CO_DINH({h_tt_dongbo,h_loaitb_id })
              }
              // Thoái trả Fsecure
              if(h_dichvuvt_id == DichVuVienThong.ANTOAN_BAOMAT_TT){
                checkResultThoaiTra =await this.handleCheckThoaiTra_CO_DINH({h_tt_dongbo, h_loaitb_id})
              }
              // Thoái trả MEGAWAN
              if(h_dichvuvt_id == DichVuVienThong.MEGAWAN){
                checkResultThoaiTra = await this.handleCheckThoaiTra_MEGAWAN({h_loaihd_id, h_loaitb_id})
              }  


              if (h_dichvuvt_id == DichVuVienThong.MEGAWAN || h_dichvuvt_id == DichVuVienThong.TSL || h_dichvuvt_id == DichVuVienThong.METRONET){
                
                "Đẩy thông tin qua webservice lên HNI"
                const resDayTTHNI = await  this.handleDayThongTin_ToHNI({h_loaihd_id, h_ma_tb});

                if(!resDayTTHNI) return false;
              }


              return checkResultThoaiTra
            }
      
          } return true;
       
        } else 
        
        return true;
      } catch (e) {
        console.log(e)
        this.$toast.error("Có lỗi: " + e);
        return false;
      }
    },
    // Thoái trả Internet
    async handleCheckThoaiTra_Internet({h_loaitb_id, h_loaihd_id, h_tt_dongbo, h_ma_tb }){

        if(this.DONGBO_TEST.TEST == false){
            
            // hủy account Internet Hợp đồng đặt mới đã kích hoạt (status = 5)
            if ( h_tt_dongbo == TRANGTHAI_DONGBO.DONGBO_CM && LoaiHopDong.DAT_MOI && h_loaihd_id != LoaiHopDong.CHUYENDOI_LH) {
              this.$toast.error( "Chỉ thoái trả cho thuê bao đã kích hoạt đối với hợp đồng lắp mới và chuyển đổi loại hình !");
              return false;
            }

            if (h_tt_dongbo == TRANGTHAI_DONGBO.DONGBO_CM && h_loaihd_id == LoaiHopDong.DAT_MOI) {
              let account = h_ma_tb;
              let lydohuy = "Hủy Account";
              let chuthich = "Hủy Account";
              let status = false;


              let array_json = [];
              array_json.push({ accountName: account});
          
              if ((h_loaitb_id == LoaiHinhTB.INTERNET_FTTH) || (h_loaitb_id == LoaiHinhTB.WIFI_FIBER) || (h_loaitb_id == LoaiHinhTB.INTERNET_ADSL) || (h_loaitb_id == LoaiHinhTB.INTERNET_1260)){
                
                const _flag = await this.TraCuuThueBao(JSON.stringify(array_json));

                if (_flag.Length == 6 || _flag.Length == 8) {
                  status = await this.removeVNN(JSON.stringify(array_json), chuthich);
                }
                if (_flag.Length == 1) {
                  status = true;
                }
              }
              else if (h_loaitb_id == LoaiHinhTB.INTERNET_MYTV){
                let info = await this.GetSubscriberInfo( JSON.stringify(array_json));

                if (info[0].IDNo === null || info[0].IDNo == null) {
                  status = true;
                } else {
                  if ( info[0].StatusID == 2 && info[0].STBID != null
                  ) {
                    //StatusID =="2" => hoạt động bt, đã k/h và khai báo STB
                    let kq_cancel = await this.CancelSubscriberV2(JSON.stringify(array_json) );
                    if (kq_cancel == 0) {
                      let kq = await this.DeleteMyTV(JSON.stringify(array_json));
                      if (kq != 0 && kq != 1) status = false;
                      else status = true;
                    } else {
                      this.$toast.error( "Kích hoạt Cancel thuê bao '" + account +"' lỗi:" +kq_cancel);
                      return false;
                    }
                  } else if (info[0].StatusID == 6) status = true;
                  // status hủy
                  else {
                    let kq = await this.DeleteMyTV(JSON.stringify(array_json));
                    if (kq != 0 && kq != 1) status = false;
                    else status = true;
                  }
                }
              }
              else if (h_loaitb_id == LoaiHinhTB.HTVC_FIBERVNN_DIGITAL || h_loaitb_id == LoaiHinhTB.HTVC_FIBERVNN_ANALOG){
                status = true;
              }
              if(!status){
                if (h_loaitb_id == LoaiHinhTB.INTERNET_MYTV){
                  this.$toast.error("Có lỗi trong quá trình hủy Account trên VASC !");
                }
                if ((h_loaitb_id == LoaiHinhTB.INTERNET_ADSL) || (h_loaitb_id == LoaiHinhTB.INTERNET_FTTH) || (h_loaitb_id == LoaiHinhTB.WIFI_FIBER)){
                  this.$toast.error( "Có lỗi trong quá trình hủy Account trên Visa !");
                }
                return false;
              }
            }

            //region Chuyển đổi loại hình 
            if (h_tt_dongbo == TRANGTHAI_DONGBO.DONGBO_CM && h_loaihd_id == LoaiHopDong.CHUYENDOI_LH){

              let check = true
              //Khác MyTV
              if (h_loaitb_id == LoaiHinhTB.INTERNET_ADSL || h_loaitb_id == LoaiHinhTB.INTERNET_FTTH || h_loaitb_id == LoaiHinhTB.WIFI_FIBER){
                check = await this.handleCheckChuyenDoiLoaiHinh_Khac_MyTV(h_ma_tb)
                if(!check) return check
              }

              // MyTV
              if (h_loaitb_id == LoaiHinhTB.INTERNET_MYTV){
                check = await this.handleChuyenDoiLoaiHinh_MyTV()
                if(!check) return check;
              }

          }
          //Hủy đặt chỗ ADSL, FTTH, 1260 trường hợp hợp đồng đặt mới, đổi số chưa kích hoạt
          if (h_tt_dongbo != TRANGTHAI_DONGBO.DONGBO_CM && (h_loaihd_id == LoaiHopDong.DAT_MOI || h_loaihd_id == LoaiHopDong.DOISO_TB || h_loaihd_id == LoaiHopDong.KHOIPHUC_SD)){
              check = await this.handleHUyDatCho_ADSL_FTTH_1260_HD_MOI(h_loaitb_id , h_ma_tb )
              if(!check) return check;
          }
          //DONGBO_GOI_DA_DV
          if ((h_loaitb_id == LoaiHinhTB.INTERNET_FTTH || h_loaitb_id == LoaiHinhTB.INTERNET_MYTV) && (h_loaihd_id == LoaiHopDong.DAT_MOI)){
            check = await this.handleDONGBO_GOI_DA_DV();
            if(!check) return check;
          }
        }

        return true;
      
    },

    async handleCheckChuyenDoiLoaiHinh_Khac_MyTV(h_ma_tb ){
        //Thực hiện đổi lại tốc độ cho thuê bao chuyển đổi loại hình
          //Nếu có sự thay đổi đối tượng thì gọi hàm thay đổi đối tượng
        const h_doituong_id = this.kq_capnhat.DOITUONG_ID;
        if(h_doituong_id){
          const resultTDDT_Visa = await this.ThayDoi_DoiTuong_Visa( h_ma_tb, h_doituong_id);
          if (resultTDDT_Visa == 0) {
            this.$toast.error("Có lỗi trong quá trình thay đổi đối tượng trên Visa !");
            return false;
          }
        }
       
        
        let dtBienDong = this.kq_capnhat.DTBIENDONG;
        let dtHopDong = this.kq_capnhat.DTHOPDONG;

        if (this.dtBienDong.length == 0) {
            this.$toast.error("Không tìm thấy thông tin biến động thuê bao hoặc thiếu thông tin biến động port! Liên hệ ADMIN để xử lý.");
          return false;
        }

        //Đổi cổng
        this.doicongacccountvisa = await this.DoiCongAcccountVisa(dtBienDong,dtHopDong[0].SO_PL);

        if (this.doicongacccountvisa == 0) {
          this.$toast.error( "Có lỗi trong quá trình đổi cổng Account " + h_ma_tb +" trên Visa !");
          return false;
        }

        //Đổi tốc độ
        const h_tucthi = 0;
        const h_account = dtBienDong[0].MA_TB;
        const h_tocdo_id = dtBienDong[0].MATOCDO || "";
        const h_ip = dtBienDong[0].IP || "";
        const h_loaicuoc_id = dtBienDong[0].MUCCUOC_ID_VDC || "";

        this.doitocdoadsl = await this.DoiTocDoADSL( h_account, h_tocdo_id,h_ip, h_tucthi, false, false );

        if (this.doitocdoadsl == 0) {
          this.$toast.error( "Có lỗi trong quá trình chuyển đổi loại hình thuê bao từ Mega sang FTTH trên Visa !" );
          return false;
        }

        //Thay đổi thông tin tính cước
        const billingInfo = dtBienDong[0].THONGTIN_TC;
        if (billingInfo != null || billingInfo != null) {
          vdcService.ChangeBillingInfo
          let kq = await this.ChangeBillingInfo( h_account, billingInfo, "Thoái trả hợp đồng");
          if (!kq) {
            this.$toast.error( "Có lỗi trong quá trình thay đổi thông tin tính cước cho thuê bao FTTH !");
            return false;
          }
        }
        //nếu thay đổi mức cước thì gọi hàm dưới
        if ( dtBienDong[0].MUCCUOC_ID != dtHopDong[0].MUCCUOC_ID) {
          if (h_loaicuoc_id == "") {
            this.$toast.error( "Có lỗi trong quá trình kích hoạt đổi mức cước FTTH trên Visa !");
            return false;
          }
          const resThayDoiHinhThucTT = await this.ThayDoiHinhThucTT( h_account, h_loaicuoc_id, h_tucthi) ;
          if (!resThayDoiHinhThucTT) {
            this.$toast.error("Có lỗi trong quá trình kích hoạt đổi mức cước FTTH trên Visa !");
            return false;
          }
        }
    },

    async handleChuyenDoiLoaiHinh_MyTV (dtBienDong){

      if (dtBienDong.length == 0) {
        this.$toast.error("Không tìm thấy thông tin biến động thuê bao hoặc thiếu thông tin biến động port! Liên hệ ADMIN để xử lý.");
        return false;
      }
      let account = dtBienDong[0].MA_TB;
      let system = dtBienDong[0].SYSTEM;
      let sPortID =`${dtBienDong[0].IP}/${dtBienDong[0].SHELF}/${dtBienDong[0].SLOT}/${dtBienDong[0].PORT}`
      const resUpdateDeviceInfo = await this.UpdateDeviceInfo(account, system, sPortID);
      return resUpdateDeviceInfo;
    },

    // Hủy đặt chỗ ADSL, FTTH, 1260 trường hợp hợp đồng đặt mới, đổi số chưa kích hoạt
    async handleHUyDatCho_ADSL_FTTH_1260_HD_MOI(h_loaitb_id , h_ma_tb ){
      if (h_loaitb_id == LoaiHinhTB.INTERNET_ADSL || h_loaitb_id == LoaiHinhTB.INTERNET_FTTH || h_loaitb_id == LoaiHinhTB.WIFI_FIBER || h_loaitb_id == LoaiHinhTB.INTERNET_1260){
        if (h_ma_tb.lengt > 0) {
          
          let handatcho = this.kq_capnhat.HANDATCHO;
            if (handatcho != null) {
              if (!(await this.HuyDatChoMegaVNN(h_ma_tb))) {
                this.$toast.error(`Có lỗi xảy ra trong quá trình hủy đặt chỗ account  ${h_ma_tb}  trên Visa!`);
                return false;
              }
            }
        }
        return true;
      }
    },

    //DONGBO_GOI_DA_DV
    async handleDONGBO_GOI_DA_DV(){

      let ds_kt1 = await this.LayDS_ThamSoMD();
      let dsTS = ds_kt1.filter(function (ds) {
        return ds.MA_TS == "DONGBO_GOI_DA_DV";
      });
        

      let dongbo_dadv = -1;
      if (dsTS.length > 0) { 
        dongbo_dadv = this.dsTS[0].TEN_TS
      }

      if (dongbo_dadv == 1) {
        this._dsGoi = this.kq_capnhat.LAY_TT_GOI_GDVP;

        if (this._dsGoi[0].GOI_HOME.length > 0) {

          let tt_nd = await this.Get_TTND();
          let _error = "";
          let _result = "";
          let _dsGoi_home = this._dsGoi[0].GOI_HOME;
          for (var i = 0; i < _dsGoi_home.length; i++) {
            _result = await this.XOA_GOI_V3(_dsGoi_home[j].GOI_NEO_ID,"84" + _dsGoi_home[j].MA_TB, _dsGoi_home[j].ACC_FIBER,"1", tt_nd.tentat );
           
            if (_result != 0) {
              this.$toast.error( "Có lỗi trong quá trình kích hoạt gói tích hợp trên VNP: " +_error );
            
              return false;
            }
          }
        }

        if (this._dsGoi[0].GOI_GDVP.length > 0) {
          let _error = "";
          let _result = "";
          let _dsGoi_gdvp = this._dsGoi[0].GOI_GDVP;

          for (var i = 0; i < _dsGoi_gdvp.length; i++) {
            _result = await this.XOA_GOI_V3(_dsGoi_gdvp[j].GOI_NEO_ID,"84" + _dsGoi_gdvp[j].MA_TB, _dsGoi_gdvp[j].ACC_FIBER, "1",tt_nd.tentat);
            if (_result != 0) {
              this.$toast.error( "Có lỗi trong quá trình kích hoạt gói tích hợp trên VNP: " +_error);
           
              return false;
            }
          }
        }
      }
      return true;
    },




    // Thoái trả IMS
    async handleCheckThoaiTra_IMS({ h_ma_tb, h_loaihd_id, h_tt_dongbo, h_loaitb_id} ){
  
        if (this.DONGBO_TEST.TEST == false){

          //Hủy số trên VTN Hợp đồng lắp mới đã kích hoạt (status = 5)
           if (h_tt_dongbo == TRANGTHAI_DONGBO.DONGBO_CM && (h_loaihd_id == LoaiHopDong.DAT_MOI || h_loaihd_id == LoaiHopDong.CHUYENDOI_LH)){
            
            if (h_loaitb_id == LoaiHinhTB.IMS_SIP || h_loaitb_id == LoaiHinhTB.IMS_POTS){
              let kq = await this.HuyThueBao(h_ma_tb);
              if (kq != 1){
                this.$toast.error("Có lỗi trong quá trình hủy thuê bao trên IMS mới !\n" + kq);
                return false;
              }
            }
            else{
              // VTNService vtn_service = new VTNService(tt_nd.user_vtn, tt_nd.pass_vtn);
              let result = await this.ThanhLyThueBao(h_ma_tb);
              if (result != 1){
                this.$toast.error("Có lỗi trong quá trình gửi kích hoạt VTN !\n" + result);
                return false;
              }
            }
          }
        }

        return true
  
    },
    //Thoái trả Cố định
    async handleCheckThoaiTra_CO_DINH(){
      const vne_id = this.kq_capnhat.ne_id;
      if(vne_id != '-1'){
          //cap nhat trang thai NE  todo
          return true;
      }

      return true;
    },

    async handleCheckThoaiTra_CO_DINH({h_loaitb_id, h_tt_dongbo}){
      if (h_loaitb_id == LoaiHinhTB.FSECURE){
        if(DONGBO_TEST.TEST == false){
          if (h_tt_dongbo == TRANGTHAI_DONGBO.DONGBO_CM && (h_loaihd_id != LoaiHopDong.DAT_MOI && h_loaihd_id != LoaiHopDong.CHUYENDOI_LH)){
            this.$toast.error("Chỉ thoái trả cho thuê bao đã kích hoạt đối với hợp đồng đăng ký mới !");
            return false;
          }
        }
      }
                                
      return true;
    },
    async handleCheckThoaiTra_MEGAWAN({ h_loaihd_id, h_loaitb_id}){
      
        return true;
    },
    // "Đẩy thông tin qua webservice lên HNI"
    async handleDayThongTin_ToHNI({ h_loaihd_id, h_ma_tb }){
      let tt_nd = await this.Get_TTND();
      let hdtb_id_hni = this.kq_capnhat.HDTB_ID_HNI;
      if (hdtb_id_hni != -1) {
        let viloai = 0;
        if (h_loaihd_id == LoaiHopDong.THAY_DOI_DV) {
          //LoaiHopDong.THAY_DOI_DV
          viloai = 2;
        } else {
          viloai = 1;
        }
        //todo
        // //tam thoi bo de huy thanh cong
        // let _obj = await this.ThucHienHoanCongHopDong( hdtb_id_hni, tt_nd.ngay_cn.ToString("dd/MM/yyyy HH:mm"), tt_nd.ten_nd, h_ma_tb, "", viloai, 2,  "Thực hiện thoái trả ","", "pttb","pttb321");
        // if (_obj == 0) {
        //   this.$toast.error("webservice_hni : " + _obj);
        //   return false;
        // }
      }
      return true;
    },



    //sau khoi thoái trả thanh cong call api
    async THOAITRA_THANHTOAN( h_loaitb_id){
      

        if (h_loaitb_id == LoaiHinhTB.INTERNET_FTTH && (h_loaihd_id == LoaiHopDong.DAT_MOI || h_loaihd_id == LoaiHopDong.CHUYENDOI_LH)) {
          let dsMyTV = this.kq_capnhat.DSMYTV;

          let drDaHC = dsMyTV.filter(function (ds) {
            return ds.TRANGTHAI_HC == 1;
          });

          if (drDaHC.length > 0) {
           
            await this.TaoDuLieu_huygoi_mytv(dsMyTV);
            let kichhoat = true;
            for (var j = 0; j < this.dsHDTB.length; j++) {
              //Kích hoạt vasc
              let vtocdo_id = -1;
              let vmuccuoc_id = 0;
              let thuebao_mytv_id = this.dsHDTB[j].THUEBAO_ID;

              let matocdo_vasc = await this.getmatocdo(thuebao_mytv_id);
              if (matocdo_vasc == -1) {
                this.$toast.error( "Thông tin về tốc độ chưa được đồng bộ lên VASC. Bạn hãy kiểm tra lại !");
                return false;
              }
              await this.KichHoatVASC(this.dsHDTB[j].MA_TB, matocdo_vasc, 0, "");
            }
          }

          if (drDaKH.Length > 0) {
         
              for (var j = 0; j < drDaKH.Length; j++) {
                let hdtb_mytv_id = drChuaKH[j].HDTB_ID;
                let goi_id = drChuaKH[j].GOI_ID;
                let nhomtb_id = drChuaKH[j].NHOMTB_ID;
              
                let matocdo_vasc = await this.getmatocdo(hdtb_mytv_id);
                if (matocdo_vasc == -1) {
                  this.$toast.error("Thông tin về tốc độ chưa được đồng bộ lên VASC. Bạn hãy kiểm tra lại !");
                  return false;
                }
                
                await this.KichHoatVASC(this.drDaKH[j].MA_TB, matocdo_vasc, 0, "" );
                //Xóa khỏi hdtb_goi_dadv : đã gộp DB
              }
            }
      }
    },



    async KichHoatVASC(MyTVAcc, matocdo_mytv, ma_goi_tichhop, lydo) {
      const IPTVAccount =  xmlUtil.ChuanHoa_XML(MyTVAcc);
      const packageNo =  xmlUtil.ChuanHoa_XML(matocdo_mytv);
      if (packageNo == "" || packageNo == null) {
        this.$toast.error(  "Gói dịch vụ MyTV này chưa được đồng bộ với VASC. Bạn không thể tiếp tục cập nhật dữ liệu." );
        return 0;
      }

      const megaMyTV =  xmlUtil.ChuanHoa_XML(ma_goi_tichhop);
      const reason =  xmlUtil.ChuanHoa_XML(lydo);

      const res = await api.changePackageAndMegaVNN(this.axios, {
        iptvaccount: IPTVAccount,
        megaMyTV: megaMyTV,
        packageNo: packageNo,
        reason: reason,
        serviceCD: "",
        serviceVAS: "",
      });
      this.vasc_status = res.data.data ? res.data.data : 0;
    },

    async XOA_GOI_V3(goi_id_neo, matb_dd, acc_fiber, typeid, agent) {
      const res = await api.changePackageAndMegaVNN(this.axios, {
        account: acc_fiber,
        agent: agent,
        msisdn: matb_dd,
        packageid: goi_id_neo,
        typeid: typeid,
      });
      let kq = res.data.data ? res.data.data : "";
      return kq;
    },


    async TaoDuLieu_huygoi_mytv(dsMyTV) {
      try{
        await this.TaoDuLieu_HDKH_huygoi_mytv(dsMyTV);
        await this.TaoDuLieu_HDTB_huygoi_mytv(dsMyTV);
      }catch(err){
        console.log(err)
      }

    },

    async TaoDuLieu_HDKH_huygoi_mytv(dsMyTV) {
      let tt_nd = await this.Get_TTND();

      let drMyTV = dsMyTV.filter(function (ds) {
        return ds.TRANGTHAI_HC == 1;
      });

      let khachhang_id = drMyTV[0].KHACHHANG_ID;
      let ar_dbkh = this.kq_capnhat.DS_DBKH;

      this.hdkh_id_huygoi_mytv = await this.POST_GET_KEYS("HD_KHACHHANG");
      ar_dbkh.MA_GD = await apiHelper.Sinh_MaGD(28);
      ar_dbkh.KHACHHANG_ID = khachhang_id;
      ar_dbkh.NGAYLAP_HD = moment(new Date()).format("DD/MM/YYYY");
      ar_dbkh.NGAY_YC = moment(new Date()).format("DD/MM/YYYY");
      ar_dbkh.GHICHU = "Tự động xóa thuê bao khỏi gói đa dịch vụ";
      ar_dbkh.DONVI_ID = tt_nd.donvi_id;
      ar_dbkh.NHANVIEN_ID = tt_nd.nhanvien_id;
      ar_dbkh.LOAIHD_ID = 28;
      ar_dbkh.NGAY_CN = moment(new Date()).format("DD/MM/YYYY");
      ar_dbkh.NGUOI_CN = tt_nd.ma_nd;
      ar_dbkh.MAY_CN = tt_nd.may_cn;
      ar_dbkh.IP_CN = tt_nd.ip;

      this.dsHDKH = ar_dbkh;
    },

    async TaoDuLieu_HDTB_huygoi_mytv(dsMyTV) {
      let tt_nd = await this.Get_TTND();
      let drMyTV = dsMyTV.filter(function (ds) {
        return ds.TRANGTHAI_HC == 1;
      });
      if (drMyTV.Length > 0) {
        this.dsHDTB = [];
        this.dsHDTBGOI = [];
        for (var i = 0; i < drMyTV.Length; i++) {
          this.hdtb_id_huygoi_mytv = await this.POST_GET_KEYS("HD_THUEBAO");
          rowHDTB = this.HD_THUEBAORow();
          rowHDTB.HDTB_ID = this.hdtb_id_huygoi_mytv;
          rowHDTB.HDKH_ID = this.hdtb_id_huygoi_mytv;
          rowHDTB.THUEBAO_ID = drMyTV[i].THUEBAO_ID;
          rowHDTB.MA_TB = drMyTV[i].MA_TB;
          rowHDTB.TEN_TB = drMyTV[i].TEN_TB;
          rowHDTB.DIACHI_TB = drMyTV[i].DIACHI_TB;
          rowHDTB.KIEULD_ID = 282;
          rowHDTB.DOITUONG_ID = drMyTV[i].DOITUONG_ID;
          rowHDTB.TTHD_ID = 1;
          rowHDTB.LOAITB_ID = 61;
          rowHDTB.DICHVUVT_ID = 4;
          rowHDTB.DONVI_ID = tt_nd.donvi_id;
          rowHDTB.NGUOI_CN = tt_nd.ma_nd;
          rowHDTB.NGAY_CN = moment(new Date()).format("DD/MM/YYYY");
          rowHDTB.MAY_CN = tt_nd.may_cn;

          //thiếu QUYTRINH_ID,MUCUOC_TB||MUCUOCTB_ID
          let dset = this.kq_capnhat.DS_HUONGGIAO;
          if (dset.length > 0) {
            this.huonggiaotn_id = dset[0].HUONGGIAO_ID;
            this.quytrinh_id_2 = dset[0].QUYTRINH_ID;
          }
          rowHDTB.QUYTRINH_ID = this.quytrinh_id_2;

          let mucuoctb_id = this.kq_capnhat.MUCUOCTB_ID;
          let mucuoctb = this.kq_capnhat.MUCUOC_TB;

          if (mucuoctb_id != -1) rowHDTB.MUCUOCTB_ID = mucuoctb_id;
          if (mucuoctb != -1) rowHDTB.MUCUOC_TB = mucuoctb;

          this.dsHDTB.push(rowHDTB);

          rowGOI = this.HDTB_GOI_DADVRow();
          rowGOI.GOI_ID = drMyTV[i].GOI_ID;
          rowGOI.NHOMTB_ID = drMyTV[i].NHOMTB_ID;
          rowGOI.CHUNHOM = 0;
          rowGOI.HDTB_ID = this.hdtb_id_huygoi_mytv;
          rowGOI.THANG_HUONG = 0;
          this.dsHDTBGOI.push(rowGOI);
        }
      }
    },


    async ThucHienHoanCongHopDong() {
      //chưa có api
      // const res = await api.abcd(this.axios, {
      //   accountModel: JSON.stringify(ar_ma_tb),
      //   attributes: ar_att,
      // });
      // let kq = res.data.data ? res.data.data : [];
      // return kq;
      return true;
    },

    async DoiCongMegavnn(ar_ma_tb, ar_att) {
      const res = await api.DoiCongMegavnn(this.axios, {
        accountModel: JSON.stringify(ar_ma_tb),
        attributes: ar_att,
      });
      let kq = res.data.data ? res.data.data : [];
      return kq;
    },

    async ChangeBillingInfo(accountName, billingInfo, note) {

      //chua co api 
      const res = await api.ChangeBillingInfo(this.axios, {
        accountModel: JSON.stringify(accountName),
        billingInfo: billingInfo,
        note: note,
      });
      let kq = res.data.data ? res.data.data : false;
      return kq;
    },

    async DoiCongAcccountVisa(dt, so_pl) {
      try {
        let i_account = dt[0].MA_TB;
        let password = dt[0].PASSWORD;
        let cusName = dt[0].TEN_TB;
        let cusAdd = dt[0].DIACHI_LD;
        let phone = dt[0].MATB_TN;
        let port = dt[0].PORT;
        let vci = dt[0].VCI;
        let vpi = dt[0].VPI;
        let slot = dt[0].SLOT;
        let soHd = so_pl;
        let brasId = dt[0].BRAS_ID;
        let systemId = dt[0].SYSTEM;
        let rackId = dt[0].RACK;
        let shelfId = dt[0].SHELF;
        if (this.thamso == 4) {
          let ar_matb = {
            accountName: i_account,
          };
          let ar_att = [];
          ar_att.push({
            type: "PORT",
            value: port,
            type: "VCI",
            value: vci,
            type: "VPI",
            value: vpi,
            type: "SLOT",
            value: slot,
            type: "BRAS-ID",
            brasId: brasId,
            type: "DSLAM-ID",
            value: this.dslamId,
            type: "PARAMETER",
            value: "VISANEW",
          });

          let result = await api.DoiCongMegavnn(ar_matb, ar_att);
          if (result == 0) return 0;
          else {
            this.$toast.success( "Đổi cổng Account " + i_account + " trên Visa thành công !");
            return 1;
          }
        } else if (this.thamso == 7) {
          let ar_matb = {
            accountName: i_account,
          };
          let ar_att = [];
          ar_att.push({
            type: "PORT",
            value: port,
            type: "VCI",
            value: vci,
            type: "VPI",
            value: vpi,
            type: "SLOT",
            value: slot,
            type: "BRAS-ID",
            brasId: brasId,
            type: "DSLAM-ID",
            value: this.dslamId,
            type: "RACKID",
            value: rackId,
            type: "SELFID",
            value: shelfId,
            type: "SYSTEMID",
            value: systemId,
            type: "PARAMETER",
            value: "VISANEW",
          });

          let result = await this.DoiCongMegavnn(ar_matb, ar_att);
          if (result == 0) {
            return 0;
          } else {
            this.$toast.success(
              "Đổi cổng Account " + i_account + " trên Visa thành công !"
            );
            return 1;
          }
        }
        return 1;
      } catch (e) {
        this.$toast.error(
          "Có lỗi xảy ra trong quá trình đổi cổng account trên Visa.\n" + e
        );
        return false;
      }
    },

    async DoiTocDoADSL(account, tocdo_id, ip, tucthi, autoIpFlag, oldIp) {
      if (tucthi == 0) {
        const res = await api.modifyServiceTypeMegaVNN(this.axios, {
          accountModel: JSON.stringify(account),
          accountServiceModel: JSON.stringify(tocdo_id),
          autoIpFlag: autoIpFlag,
          ip: ip,
          oldIp: oldIp,
        });
        let kq = res.data.data ? res.data.data : 0;
        return kq;
      } else {
        const res = await api.modifyServiceTypeMegaVNN1(this.axios, {
          accountModel: JSON.stringify(account),
          accountServiceModel: JSON.stringify(tocdo_id),
          autoIpFlag: autoIpFlag,
          ip: ip,
          oldIp: oldIp,
        });
        let kq = res.data.data ? res.data.data : 0;
        return kq;
      }
    },

    async ThayDoiHinhThucTT(account, tariffType, effectType) {
      let result = false;
      const res = await api.ThayDoiHTTT(this.axios, {
        accountModel: { accountName: account},
        accountServiceModel: {
          tariffType: tariffType,
        },
        effectType: effectType,
      });
      result = res.data.data ? res.data.data : false;
      return result;
    },

    async UpdateDeviceInfo(i_account, system, sPortID) {

      let result = -1;
      const res = await api.UpdateDeviceInfo(this.axios, {
        myTVAccount: i_account,
        strDeviceName: system,
        strPortID: sPortID,
      });
      result = res.data.data ? res.data.data : 1;
      if (result == 0) {
        return true;
      } else {
        return false;
      }
    },

    async HuyDatChoMegaVNN(account) {
      let result = -1;
      const res = await api.unReservedAccount(this.axios, {
        accountName: account,
      });
      result = res.data.data ? res.data.data : "";
      if (result.includes("chưa được đặt chỗ")) {
        return true;
      } else {
        return false;
      }
    },

    async HuyThueBao(account) {
      let result = -1;
      const res = await api.sps_service_ims_deactive(this.axios, {
        msisdn: account,
      });
      result = res.data.data ? res.data.data : false;
      if (result.Status != 9) {
        if (result.StatusMessage("52000")) {
          return true;
        } else {
          return false;
        }
      }

      return true;
    },

    async ThanhLyThueBao(account) {
      let result = -1;
      const res = await api.disconnectSubscriber(this.axios, {
        account_CODE: account,
      });
      result = res.data.data ? res.data.data : "";
      if (result.Status != 9) {
        if (result.StatusMessage("52000")) {
          return true;
        } else {
          return false;
        }
      }

      return true;
    },

    async TaoDuLieuBD(objOld, objNew, _seri_id) {
  
      this.dsBDHDDT = [];
      let row = this.BD_HDDT_DATA();
      this.BDHDDT_ID = await this.POST_GET_KEYS("BDHDDT_ID");
      row.BDHDDT_ID = this.BDHDDT_ID;
      row.MA_TT = objNew.CusCode;
      row.DONVI_ID = this.$root.token.getDonViID();
      row.NHANVIEN_ID = this.$root.token.getNhanVienID();
      row.TEN_TT = this.txtTenKhachHang;
      row.DIACHI_TT = this.txtDiaChi;
      row.MST = this.txtMaSoThue;
      if (this.txtMaSoThue == null) {
        row.MST = "";
      }
      row.EMAIL = this.txtEmail;
      row.SDT = this.txtSoDienThoai;
      row.HINHTHUC_TT = this.txtHinhThucThanhToan;
      row.TIEN = this.txtCongTienDV;
      row.VAT = this.txtTienTHueGTGT;
      row.TYLE_VAT = this.txtTHueGTGT;
      row.TIENBANGCHU = this.txtTienVietBangChu;
      if (this.vthaotac == 1) {
        row.KIEU_BD = 4;
        row.THONGTINHD_CU = "";
        row.THONGTINHD_MOI = xmlUtil.GetXMLFromObject(objNew);
        row.TRANGTHAI = 1; // Đang sử dụng
      } else if (this.vthaotac == 2) {
        // Chỉnh sửa hóa đơn
        row.THONGTINHD_CU = xmlUtil.GetXMLFromObject(objOld);
        row.THONGTINHD_MOI = xmlUtil.GetXMLFromObject(objNew);
        if (this.ddlKieuDieuChinh == 1)
          // Điều chỉnh tăng
          row.KIEU_BD = 8;
        else if (this.ddlKieuDieuChinh == 2)
          // Điều chỉnh giảm
          row.KIEU_BD = 9;
        else if (this.ddlKieuDieuChinh == 3)
          // Điều chỉnh thông tin
          row.KIEU_BD = 10;
        else row.KIEU_BD = 1;
        row.TRANGTHAI = 1; // Đang sử dụng
        row.BDHDDT_CHA_ID = this.bdhddt_cha_id;
      } else if (this.vthaotac == 3) {
        // Thay thế hóa đơn
        row.KIEU_BD = 2;
        row.THONGTINHD_CU = xmlUtil.GetXMLFromObject(objOld);
        row.THONGTINHD_MOI = xmlUtil.GetXMLFromObject(objNew);
        row.TRANGTHAI = 1; // Đang sử dụng
        row.BDHDDT_CHA_ID = this.bdhddt_cha_id;
      } else if (this.vthaotac == 4) {
        // Hủy hóa đơn
        row.KIEU_BD = 3;
        row.THONGTINHD_CU = xmlUtil.GetXMLFromObject(objOld);
        row.THONGTINHD_MOI = xmlUtil.GetXMLFromObject(objNew);
        row.TRANGTHAI = 4; // Hủy hóa đơn
        row.BDHDDT_CHA_ID = this.bdhddt_cha_id;
      } else if (this.vthaotac == 5) {
        // Hủy thanh toán + Hủy hóa đơn
        row.KIEU_BD = 11;
        row.THONGTINHD_CU = xmlUtil.GetXMLFromObject(objOld);
        row.THONGTINHD_MOI = xmlUtil.GetXMLFromObject(objNew);

        row.TRANGTHAI = 4; // Đang sử dụng
        row.BDHDDT_CHA_ID = this.bdhddt_cha_id;
      } else if (this.vthaotac == 6) {
        // Xuất hóa đơn + gạch nợ
        row.KIEU_BD = 6;
        row.THONGTINHD_CU = xmlUtil.GetXMLFromObject(objOld);
        row.THONGTINHD_MOI = xmlUtil.GetXMLFromObject(objNew);
        row.TRANGTHAI = 1; // Đang sử dụng
        row.BDHDDT_CHA_ID = this.bdhddt_cha_id;
      } else if (this.vthaotac == 8) {
        // hủy gạch nợ
        row.KIEU_BD = 7;
        row.THONGTINHD_CU = xmlUtil.GetXMLFromObject(objOld);
        row.THONGTINHD_MOI = xmlUtil.GetXMLFromObject(objNew);
        row.TRANGTHAI = 1; // Đang sử dụng
        row.BDHDDT_CHA_ID = this.bdhddt_cha_id;
      }

      row.LOAIHOADON_CU = objOld.InvoicePattern;
      row.LOAIHOADON_MOI = objNew.InvoicePattern;


      row.SERI_CU = objOld.SerialNo;
      row.SERI_MOI = objNew.SerialNo;
      row.SO_HD_CU = objOld.InvoiceNo;
      row.SO_HD_MOI = objNew.InvoiceNo;
      //duynt.hyn 16/09/2022
      row.TONGTIEN = Math.abs(Number(this.t_tien_edited));
      row.TIENGOC = this.tiengoc;
      row.NGUOI_CN = await this.$root.token.getUserName();
      row.MAY_CN = await this.$root.token.getMachine();
      row.NGAY_CN = moment(new Date()).format("DD/MM/YYYY");

      if (this.Tag == 2)
        row.GHICHU = "(Chức năng admin) " + this.txtGhiCHuHoaDon;
      else if (this.Tag == 3)
        row.GHICHU = "(Chức năng admin_) " + this.txtGhiCHuHoaDon;
      else row.GHICHU = "(Chức năng XHĐ) " + this.txtGhiCHuHoaDon;

      row.HDKH_ID = this.vhdkh_id;
      row.SERI_MOI_ID = _seri_id;
      row.LOAIHOADON_MOI_ID = this.ddlMauSo;
      row.PHIEUTT_ID = this.vphieutt_id;
      if (this.txtBienBanDinhKem != "") {
        row.FILE_DINHKEM = this.array_byte;
      }

      //add them theo comment a van 10/10/2023
      row.NGUOI_TD = row.NGUOI_CN;
      row.NGAY_TD = row.NGAY_CN;

      this.dsBDHDDT.push(row);
    },

    TaoDuLieuBDCT() {
      this.dsBDHDDTCT = [];
      for (var i = 0; i < this.grid_danhsach.length; i++) {
        if (this.grid_danhsach[i].ProdName != null && this.grid_danhsach[i].ProdName != "") {
          let row = this.BD_HDDT_CT_DATA();
          row.BDHDDT_ID = this.BDHDDT_ID;
          row.DONGIA = this.grid_danhsach[i].ProdPrice;
          row.DONVITINH = this.grid_danhsach[i].ProdUnit;
          row.NOIDUNG = this.grid_danhsach[i].ProdName;
          row.SOLUONG = this.grid_danhsach[i].ProdQuantity;
          row.STT = this.grid_danhsach[i].STT;
          row.THANHTIEN = this.grid_danhsach[i].Amount;
          this.dsBDHDDTCT.push(row);
        }
      }
    },

    async TaoDuLieuBD_v2(SerialNo1, InvoiceNo1, _seri_id, loi) {
      this.dsBDHDDT = [];
      let row = this.BD_HDDT_DATA();
      this.BDHDDT_ID = await this.POST_GET_KEYS("BDHDDT_ID");
      row.BDHDDT_ID = this.BDHDDT_ID;
      row.MA_TT = this.vma_gd;
      row.DONVI_ID = this.$root.token.getDonViID();
      row.NHANVIEN_ID = this.$root.token.getNhanVienID();
      row.TEN_TT = this.txtTenKhachHang;
      row.DIACHI_TT = this.txtDiaChi;
      row.MST = this.txtMaSoThue || "";
      row.EMAIL = this.txtEmail;
      row.SDT = this.txtSoDienThoai;
      row.HINHTHUC_TT = this.txtHinhThucThanhToan;
      row.TIEN = this.txtCongTienDV;
      row.VAT = this.txtTienTHueGTGT;
      row.TYLE_VAT = this.txtTHueGTGT;
      row.TIENBANGCHU = this.txtTienVietBangChu;
      if (loi != 0) {
        row.THANHTOAN_LOI = loi;
      }
      row.KIEU_BD = 5;
      row.TRANGTHAI = 1; // Đang sử dụng

      //hot fix
      const ddlMauSoText = this.options.mauso.find(e=>e.id == this.ddlMauSo).text;
      row.LOAIHOADON_CU = ddlMauSoText;
      row.LOAIHOADON_MOI = ddlMauSoText;

      row.SERI_CU = SerialNo1;
      row.SERI_MOI = SerialNo1;
      row.SO_HD_CU = InvoiceNo1;
      row.SO_HD_MOI = InvoiceNo1;
      row.TONGTIEN = this.t_tien_edited;
      row.TIENGOC = this.tiengoc;
      row.NGUOI_CN = await this.$root.token.getUserName();
      row.MAY_CN = await this.$root.token.getMachine();
      row.NGAY_CN = moment(new Date()).format("DD/MM/YYYY");
      if (this.Tag == 2)
        row.GHICHU = "(Chức năng admin) " + this.txtGhiCHuHoaDon;
      else if (this.Tag == 3)
        row.GHICHU = "(Chức năng admin_) " + this.txtGhiCHuHoaDon;
      else row.GHICHU = "(Chức năng XHĐ) " + this.txtGhiCHuHoaDon;

      row.HDKH_ID = this.vhdkh_id;
      row.SERI_MOI_ID = _seri_id;
      row.LOAIHOADON_MOI_ID = this.ddlMauSo;
      row.PHIEUTT_ID = this.vphieutt_id;
      if (this.txtBienBanDinhKem != "") {
        row.FILE_DINHKEM = this.array_byte;
      }
      this.dsBDHDDT.push(row);
    },

    async listInvByCus_VTT(magd, fromDate, toDate) {
      const res = await api.listInvByCus_VTT(this.axios, {
        cusCode: magd,
        fromDate: fromDate,
        toDate: toDate,
      });
      let kq = res.data.data ? res.data.data : [];

      return kq;
    },

    async listInvByCus_TT78(magd,fromDate,toDate){

      const res = await api.listInvByCus_TT78(this.axios, {
          "cusCode": magd,
          "fromDate": fromDate,
          "toDate": toDate
      })
      let kq = res.data.data
      return kq 
        
    },


    async POST_GET_KEYS(keyname) {
      let key = "";
      await api.POST_GET_KEYS(this.axios, { keyname: keyname,}).then((res) => { key = res.data.data ? res.data.data : []});
      return key;
    },

    async LayDS_ThamSoMD() {
      const res = await api.ThaoTac_Changed(this.axios, {});
      return res.data.data ? res.data.data : [];
    },

    async ThaoTac_Changed() {
      let ds_kt1 = await this.LayDS_ThamSoMD();
      let det = ds_kt1.filter(function (ds) {
        return ds.MA_TS == "XUAT_HD_CHI_SUA_ND";
      });

      let XUAT_HD_CHI_SUA_ND = 0;
      if (det.length > 0) {
        if (det[0].TEN_TS == 1) {
          XUAT_HD_CHI_SUA_ND = 1;
        }
      }
      // if (this.vthaotac == 6 && XUAT_HD_CHI_SUA_ND == 1)
      //     this.Khoa_khi_xuat_HD(true);
      // else
      //     this.Khoa_khi_xuat_HD(false);

      this.Clean();
    },

    keymonitor: async function (event) {
      if (event.key == "Enter") {
       await this.HienThiThongTin();
      }
    },

    Khoa_khi_xuat_HD(value) {
      this.disabledTenKH = value;
      this.disabledDiaChi = value;
      this.disabledMST = value;
      this.disabledMST = value;
      this.disabledHTTT = value;

      if (value == true) {
        document.getElementById("btnFile").style.display = "none";
      } else {
        document.getElementById("btnFile").style.display = "block";
      }

      this.disabledEmail = value;
      this.disabledGhiCHuHoaDon = value;
      this.disabledTheMoRong = value;
      this.disabledTienVietBangChu = value;
    },

    async downloadInvNoPay(bien) {
      const res = await api.downloadInvNoPay(this.axios, {
        invToken: bien,
      });
      let kq = res.data.data ? res.data.data : "";
      return kq;
    },





    importFile(e) {
      const myFile = e.target.files;
      if (!myFile.length) {
        return;
      } else if (!/\.(pdf|doc|docx)$/.test(myFile[0].name.toLowerCase())) {
        return alert("File upload chưa đúng định dạng (.pdf/.doc/.docx)");
      }
      this.array_byte = [];
      this.txtBienBanDinhKem = myFile[0].name;

      var reader = new FileReader();
      var fileByteArray = [];
      reader.readAsArrayBuffer(myFile[0]);
      reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
          var arrayBuffer = evt.target.result,
            array = new Uint8Array(arrayBuffer);
          for (var i = 0; i < array.length; i++) {
            fileByteArray.push(array[i]);
          }
        }
      };
      this.array_byte = fileByteArray;
      var input = document.getElementById("upload-file");
      input.value = "";
    },

    async Kiemtra_dulieu(_thaotac) {
      let tt_nd = await this.Get_TTND();

      if (tt_nd.user_hddt_td === null) {
        this.$toast.error("Người dùng chưa được cấp tài khoản xuất hóa đơn !");
        return false;
      }

      this.tiengoc = 0;
      this.kt_tongtien = 0

      if (this.txtDiaChi == "") {
        this.$toast.error("Địa chỉ khách hàng không được để trống !");
        return false;
      }
      let kt_km = false;
      for (var i = 0; i < this.grid_danhsach.length; i++) {
        if (this.grid_danhsach[i].ProdName != null) {
          kt_km = true;
          break;
        }
      }
      if (kt_km == false) {
        this.$toast.error("Kiểm tra lại dịch vụ sử dụng trên lưới !");
        return false;
      }

      const params = {
          hdkh_id: this.vhdkh_id,
          tag_form: this.Tag,
          nguoidung_id: this.$root.token.getNguoiDungID(),
          ma_nd: this.$root.token.getUserName(),
          may_cn: await this.$root.token.getMachine(),
          ip_cn: await this.$root.token.getIP(),
          donvi_id: this.$root.token.getDonViID(),
          ngay_cn: moment(new Date()).format("DD/MM/YYYY"),
          nhanvien_hd_id: this.vnhanvien_id,
          nhanvien_id: this.$root.token.getNhanVienID(),
          ma_gd: this.txtMaGD,
          js_bd_hddt: [],
          js_bd_hddt_ct: [],
          js_ds_thoai: [],
          thaotac: this.vthaotac,
          loaihoadon_id: this.ddlMauSo,
          seri_id: this.ddlKyHieu,
          seri: this.options.kyhieu[0].text,
          soseri: this.txtSoHoaDon,
          thaydoi_doituong_visa: this.thaydoi_doituong_visa,
          doicongacccountvisa: this.doicongacccountvisa, 
          doitocdoadsl: this.doitocdoadsl,
          huonggiao_id: this.huonggiaotn_id,
          vasc_status: this.vasc_status,
        };
       
      this.kq_capnhat = await this.xuatHDDT_CapNhat(params);
      console.log("this.kq_capnhat", this.kq_capnhat )
      
      this.ds_kt = this.kq_capnhat.DS_KT;
      
     
      for (var i = 0; i < this.ds_kt.length; i++) {
        if (this.ds_kt[i].KIEU_BD == "4" || this.ds_kt[i].KIEU_BD == "5" || this.ds_kt[i].KIEU_BD == "8")
          this.kt_tongtien = Number(this.kt_tongtien) + Number(this.ds_kt[i].TONGTIEN);
        else if (this.ds_kt[i].KIEU_BD == "3" ||this.ds_kt[i].KIEU_BD == "9" || this.ds_kt[i].KIEU_BD == "11")
          this.kt_tongtien = Number(this.kt_tongtien) - Number(this.ds_kt[i].TONGTIEN); 
      }

      
      this.tiengoc = this.kt_tongtien;
      let vnguoicn = "";
        if (this.ds_kt.length > 0) {
          vnguoicn = this.ds_kt[0].NGUOI_CN;
        }
      let check = true;
      if (_thaotac == 1 || _thaotac == 6) {
        check = await this.handelKiemTraDuLieu_XuatHoaDon();
      } else if (_thaotac == 2) {
        check = await this.hanldeKiemTraDulieu_DieuCHinhHoaDon(vnguoicn);
      } else if (_thaotac == 3) {
        check = await this.handleKiemTraDuLieu_ThayTheHoaDon(vnguoicn);
      } else if (_thaotac == 4) {
        // Hủy hóa đơn
        check = await this.handleKiemtraDulieu_HuyHoaDon(vnguoicn);
      } else if (_thaotac == 9 || _thaotac == 10) {
          // Chuyển đổi hóa đơn
          check = await this.handleKiemTraDuLieu_ChuyenDoiHoaDon();
      } else if (_thaotac == 7) {
        // thanh toán hóa đơn
        check = await this.handleKiemTraDuLieu_ThanhToanHoaDon();
      } else if (_thaotac == 8) {
        // hủy thanh toán hóa đơn
        check = await this.handleKiemTraDuLieu_HuyThanhToanHoaDon();
      } else if (_thaotac == 5) {
        // hủy thanh toán + hủy hóa đơn
        check = await this.handleKiemtraDulieu_HuyThanhToan_HuyHoaDon(vnguoicn)
      }
      return check;
    },

    async handelKiemTraDuLieu_XuatHoaDon(){
      // Xuất hóa đơn

      if (this.Tag == 1 && this.khoa == 2) {
          this.$toast.error( "Phiếu thanh toán đã bị Khóa. Bạn không thể thao tác !" );
          return false;
        }
        if (this.Tag != 2) {
          if (this.vlamtron_dongia) {
            if ( Math.abs(Number(this.t_tien_edited) - Number(this.t_tien_load)) >= 1) {
              this.$toast.error("Tổng tiền xuất hóa đơn điện tử không đúng với tổng tiền thanh toán !");
              return false;
            }
          } else {
            if (this.t_tien_edited != this.t_tien_load) {
              this.$toast.error("Tổng tiền xuất hóa đơn điện tử không đúng với tổng tiền thanh toán !");
              return false;
            }
          }
          if (this.da_xuathd == true) {
            this.$toast.error("Hợp đồng đã xuất hóa đơn. Bạn không được thực hiện thao tác này !");
            return false;
          }
          if (Number(this.txtTongCongTienThanhToan) < 0) {
            this.$toast.error("Tiền xuất hóa đơn không được Âm !");
            return false;
          }
        }
        return true;
    },

    async hanldeKiemTraDulieu_DieuCHinhHoaDon(vnguoicn){
      // Điều chỉnh hóa đơn
      if (this.Tag == 1 && this.khoa == 2) {
          this.$toast.error( "Phiếu thanh toán đã bị Khóa. Bạn không thể thao tác !");
          return false;
      }

      if (this.ddlKieuDieuChinh == 0) {
        this.$toast.error("Bạn chưa chọn kiểu điều chỉnh !");
        return false;
      }

      if (this.da_xuathd == false) {
        this.$toast.error(  "Hợp đồng chưa xuất hóa đơn. Bạn không được thực hiện thao tác này !");
        return false;
      }

      console.log("vnguoicn: ", vnguoicn  );
      if (this.Tag != 2 && this.Tag != 3) {
        if (this.ktra_quyen == 0) {
          if (this.vnhanvien_id !=  this.$root.token.getNhanVienID()) {
            if (!vnguoicn || vnguoicn != this.$root.token.getUserName()) {
              this.$toast.error( "Bạn không được điều chỉnh hóa đơn do người khác tạo !");
              return false;
            }                
          }
        }
      }

        //Kiểm tra xem khách hàng đã xem hóa đơn hay chưa

        //đã sửa 1
        let kq = "";
        if(this.vtt_hddt_hd_user == 1)
        {
          kq = await this.listInvByCus_VTT(this.objHoaDonDienTu.CusCode ,"","");
        }
        else
        {
          kq = await this.listInvByCus_TT78(this.objHoaDonDienTu.CusCode,"","");
        }

   
        if (kq?.substring(0, 3) == "ERR") {
          this.$toast.error(kq);
          return false;
        } else {
          let objKetQua = xmlUtil.ObjectToXML(kq);
          let ar_kq = [];

          for (var i = 0;i < objKetQua.getElementsByTagName("Item").length;i++) {
            if (
              objKetQua.getElementsByTagName("invToken")[i].textContent ==this.invToken) {
              ar_kq.push({
                invToken: this.invToken,
                fkey: objKetQua.getElementsByTagName("fkey")[i].textContent,
                status: objKetQua.getElementsByTagName("status")[i].textContent,
              });
              break;
            }
          }
          this.Fkey = ar_kq[0].fkey;
          if (this.Tag != 2) {
            if (ar_kq[0].status != 1 && ar_kq[0].status != 4) {
              this.$toast.error(
                "Hóa đơn đã bị thay thế/hủy. Không thể điều chỉnh !"
              );
              return false;
            }
          }
        }

        if (this.objHoaDonDienTu.CusCode == null) {
          this.$toast.error("Không có thông tin khách hàng để điều chỉnh");
          return false;
        }
        if (this.objHoaDonDienTu.CusName == null) {
          this.$toast.error("Tên khách hàng không được để trống !");
          return false;
        }
        if (this.objHoaDonDienTu.CusAddress == null) {
          this.$toast.error("Địa chỉ khách hàng không được để trống !");
          return false;
        }

        // console.log('t_tien_tt,t_tien_thoaitra,kt_tongtien,t_tien_edited', this.t_tien_tt, this.t_tien_thoaitra, this.kt_tongtien, this.t_tien_edited)
        if (this.Tag != 2 && this.Tag != 3) {
          
          if (this.ddlKieuDieuChinh == 1) {
            // điều chỉnh tăng
            if (this.i_thoaitra_tmp == 0 ||(this.i_thoaitra_tmp == 1 && this.t_tien_thoaitra != 0)) {
              if (Math.abs(this.t_tien_edited) == 0) {
                this.$toast.error("Tiền điều chỉnh phải khác 0");
                return false;
              }
            }

            if ( Number(this.t_tien_tt) + Number(this.t_tien_thoaitra) != Number(this.kt_tongtien) + Math.abs(Number(this.t_tien_edited))) {
              this.$toast.error( "Tiền hóa đơn điện tử lệch với tiền hợp đồng. Bạn hãy kiểm tra lại tiền điều chỉnh!" );
              return false;
            }

          }

          if (this.ddlKieuDieuChinh == 2) {
            // điều chỉnh giảm
            if (this.i_thoaitra_tmp == 0 ||(this.i_thoaitra_tmp == 1 && this.t_tien_thoaitra != 0)) {
              if (this.t_tien_edited == 0) {
                this.$toast.error("Tiền điều chỉnh phải khác 0");
                return false;
              }
            }
            console.log( "t_tien_tt: ", Math.abs(Number(this.t_tien_tt)));
            console.log( "t_tien_thoaitra: ", Math.abs(Number(this.t_tien_thoaitra)));

            console.log( "kt_tongtien: ", Math.abs(Number(this.kt_tongtien)));
            console.log( "t_tien_edited: ", Math.abs(Number(this.t_tien_edited)));
            if ( Number(this.t_tien_tt) + Number(this.t_tien_thoaitra) != Number(this.kt_tongtien) - Math.abs(Number(this.t_tien_edited))) {
              this.$toast.error("Tiền hóa đơn điện tử lệch với tiền hợp đồng. Bạn hãy kiểm tra lại tiền điều chỉnh !");
              return false;
            }
          }
          if (this.ddlKieuDieuChinh == 3) {
            // điều thông tin
            if (this.i_thoaitra_tmp == 1) {
              this.$toast.error("Hợp đồng đang có thoái trả tạm. Bạn không được điều chỉnh thông tin !" );
              return false;
            }
            if (this.t_tien_edited != 0) {
              this.$toast.error("Điều chỉnh thông tin. Khoản mục tiền phải = 0 !");
              return false;
            }
          }
        }
        return true;
    },
    async handleKiemTraDuLieu_ThayTheHoaDon(vnguoicn){
      // Thay thế hóa đơn
      if (this.Tag == 1 && this.khoa == 2) {
          this.$toast.error("Phiếu thanh toán đã bị Khóa. Bạn không thể thao tác !");
          return false;
        }

        if (this.Tag != 2) {
          if (Number(this.t_tien_tt) != Number(this.t_tien_edited)) {
            this.$toast.error("Tiền hóa đơn điện tử lệch với tiền hợp đồng. Bạn hãy kiểm tra lại tiền thay thế !");
            return false;
          }
       

          if (this.ktra_quyen == 0) {
            if (this.vnhanvien_id != Number(await this.$root.token.getNhanVienID())) {
              if (!vnguoicn || vnguoicn != (await this.$root.token.getUserName())) {
                this.$toast.error( "Bạn không được thay thế hóa đơn do người khác tạo !");
                return false;
              }                
            }
          }
        }
        if (this._dieuchinh == 1) {
          this.$toast.error("Hợp đồng đã có hóa đơn bị điều chỉnh. Bạn không thể Thay thế !");
          return false;
        }

        //Kiểm tra xem khách hàng đã xem hóa đơn hay chưa

        //đã sửa 1
        let kq = "";
        if(this.vtt_hddt_hd_user == 1)
        {
          kq = await this.listInvByCus_VTT(this.objHoaDonDienTu.CusCode,"","");
        }
        else
        {
          kq = await this.listInvByCus_TT78(this.objHoaDonDienTu.CusCode,"","");
        }

        if (kq?.substring(0, 3) == "ERR") {
          this.$toast.error(kq);
          return false;
        } else {
          let objKetQua = xmlUtil.ObjectToXML(kq);
          let ar_kq = [];

          for (var i = 0;i < objKetQua.getElementsByTagName("Item").length;i++) {
            if (
              (objKetQua.getElementsByTagName("invToken")[i].textContent ==
                this.invToken)
            ) {
              ar_kq.push({
                invToken: this.invToken,
                fkey: objKetQua.getElementsByTagName("fkey")[i].textContent,
                status: objKetQua.getElementsByTagName("status")[i].textContent,
              });
            }
          }

          this.Fkey = ar_kq[0].fkey;
          if (ar_kq[0].status != 1) {
            this.$toast.error("Hóa đơn đã bị thay thế/sửa đổi/hủy. Không thể thay thế !");
            return false;
          }

          if (this.objHoaDonDienTu.CusCode == null) {
            this.$toast.error("Mã khách hàng không để để trống");
            return false;
          }
          if (this.objHoaDonDienTu.CusName == null) {
            this.$toast.error("Tên khách hàng không được để trống !");
            return false;
          }
          if (this.objHoaDonDienTu.CusAddress == null) {
            this.$toast.error("Địa chỉ khách hàng không được để trống !");
            return false;
          }


          if (this.Tag != 2) {
            if (this.ktra_quyen == 0) {
              if (this.vnhanvien_id != Number(await this.$root.token.getNhanVienID())) {
                if (!vnguoicn || vnguoicn != (await this.$root.token.getUserName())) {
                  this.$toast.error( "Bạn không được thay thế hóa đơn do người khác tạo !");
                  return false;
                }                
              }
            }
          }
        }
      return true;
    },

    async handleKiemtraDulieu_HuyHoaDon(vnguoicn){
      // Hủy hóa đơn
      if (this.Tag == 1 && this.khoa == 2) {
          this.$toast.error( "Phiếu thanh toán đã bị Khóa. Bạn không thể thao tác !");
          return false;
        }

        if (this.Tag != 2 && this.Tag != 3) {
          if (this.ktra_quyen == 0) {
            if (this.vnhanvien_id != Number(await this.$root.token.getNhanVienID())) {
              if (!vnguoicn || vnguoicn != (await this.$root.token.getUserName())) {
                this.$toast.error("Bạn không được hủy hóa đơn do người khác tạo !");
                return false;
              }                
            }
          }
          if (this._dieuchinh == 1) {
            this.$toast.error( "Hợp đồng đã có hóa đơn bị điều chỉnh. Bạn không thể hủy !");
            return false;
          }
          if (this._thaythe == 1) {
            this.$toast.error( "Hợp đồng đã có hóa đơn bị thay thế. Bạn không thể hủy !" );
            return false;
          }
   

          //Kiểm tra xem khách hàng đã xem hóa đơn hay chưa
          //đã sửa 1
          let kq = "";
          if(this.vtt_hddt_hd_user == 1)
          {
            kq = await this.listInvByCus_VTT(this.objHoaDonDienTu.CusCode,"","");
          }
          else
          {
            kq = await this.listInvByCus_TT78(this.objHoaDonDienTu.CusCode,"","");
          }


          if (kq.substring(0, 3) == "ERR") {
            this.$toast.error(kq);
            return false;
          } else {
            let objKetQua = xmlUtil.ObjectToXML(kq);
            let ar_kq = [];

            for (var i = 0;i < objKetQua.getElementsByTagName("Item").length; i++ ) {
              if ( (objKetQua.getElementsByTagName("invToken")[i].textContent = this.invToken)) {
                ar_kq.push({
                  invToken: this.invToken,
                  fkey: objKetQua.getElementsByTagName("fkey")[i].textContent,
                  status:
                    objKetQua.getElementsByTagName("status")[i].textContent,
                  payment:
                    objKetQua.getElementsByTagName("payment")[i].textContent,
                });
                break;
              }
            }

            this.Fkey = ar_kq[0].fkey;

            if (ar_kq[0].payment == 1) {
              this.$toast.error("Hóa đơn đã được thanh toán. Không thể hủy !");
              return false;
            }

            if (ar_kq[0].status != 1) {
              this.$toast.error( "Hóa đơn đã được Điều chỉnh/Thay thế/Hủy. Bạn không thể hủy !");
              return false;
            }
          }
        }
        return true;
    },

    async handleKiemTraDuLieu_ChuyenDoiHoaDon(){
      // Chuyển đổi hóa đơn
      if (this.Tag == 1 && this.khoa == 2) {
          this.$toast.error( "Phiếu thanh toán đã bị Khóa. Bạn không thể thao tác !");
          return false;
        }
        //Kiểm tra xem khách hàng đã xem hóa đơn hay chưa

        //đã sửa 1
        let kq = ""
        if(this.vtt_hddt_hd_user == 1)
        {
          kq = await this.listInvByCus_VTT(this.objHoaDonDienTu.CusCode,"","");
        }
        else
        {
          kq = await this.listInvByCus_TT78(this.objHoaDonDienTu.CusCode,"","");
        }


        if (kq.substring(0, 3) == "ERR") {
          this.$toast.error(kq);
          return false;
        } else {
          let objKetQua = xmlUtil.ObjectToXML(kq);
          let ar_kq = [];

          for ( var i = 0; i < objKetQua.getElementsByTagName("Item").length; i++ ) {
            if (
              (objKetQua.getElementsByTagName("invToken")[i].textContent =
                this.invToken)
            ) {
              ar_kq.push({
                invToken: this.invToken,
                fkey: objKetQua.getElementsByTagName("fkey")[i].textContent,
                status: objKetQua.getElementsByTagName("status")[i].textContent,
              });
              break;
            }
          }
          this.Fkey = ar_kq[0].fkey;
          if (ar_kq[0].status != 1) {
            this.$toast.error("Hóa đơn đã được Điều chỉnh/Thay thế/Hủy. Bạn không thể hủy !");
            return false;
          }
        }
        return true;
    },

    async handleKiemTraDuLieu_ThanhToanHoaDon(){
       // thanh toán hóa đơn
      if (this.Tag == 1 && this.khoa == 2) {
        this.$toast.error( "Phiếu thanh toán đã bị Khóa. Bạn không thể thao tác !");
        return false;
      }
      //Kiểm tra xem khách hàng đã xem hóa đơn hay chưa

      let kq = "";
      if(this.vtt_hddt_hd_user == 1)
      {
        kq = await this.listInvByCus_VTT(this.objHoaDonDienTu.CusCode,"","");
      }
      else
      {
        kq = await this.listInvByCus_TT78(this.objHoaDonDienTu.CusCode,"","");
      }


      if (kq.substring(0, 3) == "ERR") {
        this.$toast.error(kq);
        return false;
      } else {
        let objKetQua = xmlUtil.ObjectToXML(kq);
        let ar_kq = [];

        for ( var i = 0;i < objKetQua.getElementsByTagName("Item").length; i++) {
          if ((objKetQua.getElementsByTagName("invToken")[i].textContent = this.invToken)) {
            ar_kq.push({
              invToken: this.invToken,
              fkey: objKetQua.getElementsByTagName("fkey")[i].textContent,
              status: objKetQua.getElementsByTagName("status")[i].textContent,
              payment:
                objKetQua.getElementsByTagName("payment")[i].textContent,
            });
            break;
          }
        }
     
        this.Fkey = ar_kq[0].fkey;
        if (ar_kq[0].payment == 1) {
          this.$toast.error("Hóa đơn đã được thanh toán. Bạn không thể thực hiện thao tác này !");
          return false;
        }
        if (ar_kq[0].status != 1) {
          this.$toast.error("Hóa đơn đã được điều chỉnh hoặc bị hủy !");
          return false;
        }
      }
      return true;
    },

    async handleKiemTraDuLieu_HuyThanhToanHoaDon(){
      // hủy thanh toán hóa đơn
      if (this.Tag == 1 && this.khoa == 2) {
          this.$toast.error("Phiếu thanh toán đã bị Khóa. Bạn không thể thao tác !");
          return false;
      }
        //Kiểm tra xem khách hàng đã xem hóa đơn hay chưa
        //đã sửa 1
        let kq = "";
        if(this.vtt_hddt_hd_user == 1)
        {
          kq = await this.listInvByCus_VTT(this.objHoaDonDienTu.CusCode,"","");
        }
        else
        {
          kq = await this.listInvByCus_TT78(this.objHoaDonDienTu.CusCode,"","");
        }

        if (kq.substring(0, 3) == "ERR") {
          this.$toast.error(kq);
          return false;
        } else {
          let objKetQua = xmlUtil.ObjectToXML(kq);
          let ar_kq = [];

          for (var i = 0;i < objKetQua.getElementsByTagName("Item").length;i++) {
            if (
              (objKetQua.getElementsByTagName("invToken")[i].textContent ==
                this.invToken)
            ) {
              ar_kq.push({
                invToken: this.invToken,
                fkey: objKetQua.getElementsByTagName("fkey")[i].textContent,
                status: objKetQua.getElementsByTagName("status")[i].textContent,
                payment:
                  objKetQua.getElementsByTagName("payment")[i].textContent,
              });
              break;
            }
          }
          this.Fkey = ar_kq[0].fkey;
          if (ar_kq[0].payment == 0) {
            this.$toast.error( "Hóa đơn chưa được thanh toán. Bạn không thể thực hiện thao tác này !");
            return false;
          }
          if (ar_kq[0].status != 1) {
            this.$toast.error("Hóa đơn đã được điều chỉnh hoặc bị hủy !");
            return false;
          }
        }
        return true;
    },

    async handleKiemtraDulieu_HuyThanhToan_HuyHoaDon(vnguoicn){
     // hủy thanh toán + hủy hóa đơn
     if (this.Tag == 1 && this.khoa == 2) {
          this.$toast.error( "Phiếu thanh toán đã bị Khóa. Bạn không thể thao tác !" );
          return false;
        }

        if (this.Tag != 2) {
          if (this.ktra_quyen == 0) {
            if (this.vnhanvien_id != Number(await this.$root.token.getNhanVienID())) {
              if (!vnguoicn || vnguoicn != (await this.$root.token.getUserName())) {
                this.$toast.error( "Bạn không được hủy hóa đơn do người khác tạo !");
                return false;
              }                
            }
          }
          if (this._dieuchinh == 1) {
            this.$toast.error(  "Hợp đồng đã có hóa đơn bị điều chỉnh. Bạn không thể hủy !");
            return false;
          }
          if (this._thaythe == 1) {
            this.$toast.error( "Hợp đồng đã có hóa đơn bị thay thế. Bạn không thể hủy !");
            return false;
          }
          console.log("t_tien_thoaitra",this.t_tien_thoaitra);
          console.log("t_tien_edited", this.t_tien_edited);
          if (this.t_tien_thoaitra != this.t_tien_edited) {
            this.$toast.error( "Tồn tại hợp đồng chưa thoái trả tạm. Ban không thể hủy !");
            return false;
          }

          //Kiểm tra xem khách hàng đã xem hóa đơn hay chưa
          //đã sửa 1
          let kq = "";
          if(this.vtt_hddt_hd_user == 1)
          {
            kq = await this.listInvByCus_VTT(this.objHoaDonDienTu.CusCode,"","");
          }
          else
          {
            kq = await this.listInvByCus_TT78(this.objHoaDonDienTu.CusCode,"","");
          }

          if (kq.substring(0, 3) == "ERR") {
            this.$toast.error(kq);
            return false;
          } else {
            let objKetQua = xmlUtil.ObjectToXML(kq);
            let ar_kq = [];

            for ( var i = 0;i < objKetQua.getElementsByTagName("Item").length;i++) {
              if (
                (objKetQua.getElementsByTagName("invToken")[i].textContent ==
                  this.invToken)
              ) {
                ar_kq.push({
                  invToken: this.invToken,
                  fkey: objKetQua.getElementsByTagName("fkey")[i].textContent,
                  status:
                    objKetQua.getElementsByTagName("status")[i].textContent,
                  payment:
                    objKetQua.getElementsByTagName("payment")[i].textContent,
                });
                break;
              }
            }
            this.Fkey = ar_kq[0].fkey;
            if (ar_kq[0].payment == 0) {
              this.$toast.error(
                "Hóa đơn chưa được thanh toán. Bạn không thể thực hiện thao tác này !"
              );
              return false;
            }
            if (ar_kq[0].status != 1) {
              this.$toast.error(
                "Hóa đơn đã được điều chỉnh, thay thế hoặc bị hủy. Không thể thực hiện thao tác này !"
              );
              return false;
            }
          }
        }
        return true;
    },


    clickButton(key) {
      if (key == "nhapmoi") {
        this.$nextTick(() => {
          this.$refs["tenKHRef"].focus();
        });
        this.Clean();
      }

      if (key == "capnhat") {
        let confirmText = "Bạn có muốn chắc chắn cập nhật không ?";
        if (this.vthaotac == 5) {
          confirmText = "Bạn có chắc chắn muốn hủy hóa đơn không?";
        }
        this.$confirm(confirmText, {
          confirmButtonText: "Có",
          cancelButtonText: "Không",
          type: "warning",
        }).then(async () => {
          this.CapNhat();
        });
      }

      if (key == "khoaphieu") {
        this.$confirm(`Bạn thật sự muốn khóa phiếu  ?`, {
          confirmButtonText: "Có",
          cancelButtonText: "Không",
          type: "warning",
        }).then(async () => {
          this.KhoaPhieu();
        });
      }
    },

    async KhoaPhieu() {
      let obj = { phieutt_id: this.vphieutt_id };
      let data = {
        ds_para: JSON.stringify(obj),
        phanvung_id: 0,
      };

      let response = await api.KhoaPhieu(this.axios, data);
      if (response.data.error_code == "BSS-00000000") {
        this.$toast.success("Khóa phiếu thành công !");
      } else {
        this.$toast.error("Có lỗi xẩy ra !");
      }
    },

    setDataFromApiXuatHDDTLoad(js_returnds){

      if (js_returnds.DS_MESSAGE != null && Array.isArray(this.js_returnds) && js_returnds.DS_MESSAGE.length > 0) {
        this.tieude = js_returnds.DS_MESSAGE[0].TIEUDE || "";
        this.noidung = js_returnds.DS_MESSAGE[0].NOIDUNG || "";
      }

      this.options.mauso =  js_returnds.DS_LOAI_HOADON?.map(i => ({id:i.LOAIHOADON_ID, text:i.TEN_LOAIHD})) || [];
      this.ddlMauSo = this.options.mauso[0]?.id || 0;

      //danh sach thao tac
      this.options.thaotac  = js_returnds.DS_THAOTAC?.map(i => ({id:i.THAOTAC_ID, text:i.THAOTAC})).filter(e=> e.id != 0)
  
      this.vthaotac = Array.isArray(this.options.thaotac) && this.options.thaotac.length > 0 ? this.options.thaotac[0]?.id || 0 : 0;

      //danh sach kieu dieu chinh
    
      this.options.kieudieuchinh = js_returnds.DS_DIEUCHINH?.map(i=>({id:i.DIEUCHINH_ID, text:i.DIEUCHINH}));

      this.ddlKieuDieuChinh = Array.isArray(this.options.kieudieuchinh) && this.options.kieudieuchinh.length > 0 ? this.options.kieudieuchinh[0]?.id || 0 : 0;
      
      //danh sach ngan hang
      const dsNganHang = js_returnds.DS_NGANHANG || [];
      this.cboBank.options = _.concat([{NGANHANG_ID: 0, TEN_NH:"----"}], dsNganHang);
    },

    //update 18/06/2024 IT360-1153799
    async checkHuyHoaDon_HDThoaiTraTam(){
      //nếu là admin thì ko cần check 
      // const url = this.$route.fullPath;
      // if(url.includes('eInvoiceAdmin')) return true;
      if(!this.vhdkh_id) return false;
      const response = await api.checkHuyHDThoaiTraTam(this.axios, this.vhdkh_id, this.Tag);
      const str = apiHelper.getErrorMessage(response) 
      if(str == 'OK') return true
      this.$toast.error(str)
      return false;
    }

  },
  computed:{
    cboBankName : function() {
        const bank = this.cboBank.options.find(e=>e.NGANHANG_ID == this.cboBank.value )
        return bank.TEN_NH || ""
      }
  }
};
</script>
<style>
li.non-active a {
  color: #d3d3d3 !important;
}

.traphieu .page-content {
  position: unset;
}

.modal-dialog {
  border-radius: 0px !important;
  width: 100% !important;
  min-width: 720px !important;
}
.e-grid .e-rowcell.customcss {
  color: red !important;
}
.list-actions-top ul li {
  cursor: pointer;
}
</style>
