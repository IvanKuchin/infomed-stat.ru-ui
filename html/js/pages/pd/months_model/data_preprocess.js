/*global dfd*/

export default class DatasetPreprocess {

	constructor() {
		this._medical_records	= [];
		this._dictionary		= {};
		this._string_columns	= [];
		this._date_columns		= [];
		this._drop_columns		= [];

		// Y must have a single value, therefore single value selects from the list ordered by importance
		// first is the most important, second is less, etc ...
		// actual Y-value calculated as difference between Y_reference and death_date
		this._Y_reference		= ["___neoadj_chemo___start_date", "___op_done___invasion_date"];
		this._death_column		= "___death_date";

this._dictionary.___last_name 														= { delete: true , type: "string"  };
this._dictionary.___first_name 														= { delete: true , type: "string"  };
this._dictionary.___middle_name 													= { delete: true , type: "string"  };
this._dictionary.___medical_history_number 											= { delete: true , type: "string"  };
this._dictionary.___phone 															= { delete: true , type: "string"  };
this._dictionary.___birthdate 														= { delete: false, type: "date"    };
this._dictionary.___zip_code 														= { delete: true , type: "string"  };
this._dictionary.___region 															= { delete: true , type: "string"  };
this._dictionary.___locality 														= { delete: true , type: "string"  };
this._dictionary.___comment 														= { delete: true , type: "string"  };
this._dictionary.___cancer_type 													= { delete: false, type: "string"  };
this._dictionary.___non_pancreatobiliary_sickness 									= { delete: false, type: "string"  };
this._dictionary.___ecog_status								 						= { delete: false, type: "int32"   };
this._dictionary.___resectability 													= { delete: false, type: "string"  };
this._dictionary.___brca 															= { delete: false, type: "string"  };	
this._dictionary.___brca_localization_breast 										= { delete: false, type: "string"  };
this._dictionary.___brca_localization_ovaries 										= { delete: false, type: "string"  };
this._dictionary.___pre_op 															= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___portal_vein 										= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___sup_mesent_vein 									= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___venous_confluence 									= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___top_branches 										= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___portal_vein___lesion_volume 						= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___portal_vein___roughness_contour 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___portal_vein___envasion_extent 						= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___portal_vein___thrombosis 							= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___sup_mesent_vein___lesion_volume 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___sup_mesent_vein___roughness_contour 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___sup_mesent_vein___envasion_extent 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___sup_mesent_vein___thrombosis 						= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___venous_confluence___lesion_volume 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___venous_confluence___roughness_contour 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___venous_confluence___envasion_extent 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___venous_confluence___thrombosis 						= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___top_branches___lesion_volume 						= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___top_branches___roughness_contour 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___top_branches___envasion_extent 						= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___top_branches___thrombosis 							= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___sup_mesent_artery 									= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___celiac_trunk 										= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___common_hepatic_art 									= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___sup_mesent_artery___lesion_volume 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___sup_mesent_artery___roughness_contour 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___sup_mesent_artery___envasion_extent 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___sup_mesent_artery___thrombosis 						= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___celiac_trunk___lesion_volume 						= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___celiac_trunk___roughness_contour 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___celiac_trunk___envasion_extent 						= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___celiac_trunk___thrombosis 							= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___common_hepatic_art___lesion_volume 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___common_hepatic_art___roughness_contour 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___common_hepatic_art___envasion_extent 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_ct___common_hepatic_art___thrombosis 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___portal_vein 										= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___sup_mesent_vein 									= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___venous_confluence 								= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___top_branches 									= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___portal_vein___lesion_volume 						= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___portal_vein___roughness_contour 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___portal_vein___envasion_extent 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___portal_vein___thrombosis 						= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___sup_mesent_vein___lesion_volume 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___sup_mesent_vein___roughness_contour 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___sup_mesent_vein___envasion_extent 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___sup_mesent_vein___thrombosis 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___venous_confluence___lesion_volume 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___venous_confluence___roughness_contour 			= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___venous_confluence___envasion_extent 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___venous_confluence___thrombosis 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___top_branches___lesion_volume 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___top_branches___roughness_contour 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___top_branches___envasion_extent 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___top_branches___thrombosis 						= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___sup_mesent_artery 								= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___celiac_trunk 									= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___common_hepatic_art 								= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___sup_mesent_artery___lesion_volume 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___sup_mesent_artery___roughness_contour 			= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___sup_mesent_artery___envasion_extent 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___sup_mesent_artery___thrombosis 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___celiac_trunk___lesion_volume 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___celiac_trunk___roughness_contour 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___celiac_trunk___envasion_extent 					= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___celiac_trunk___thrombosis 						= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___common_hepatic_art___lesion_volume 				= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___common_hepatic_art___roughness_contour 			= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___common_hepatic_art___envasion_extent 			= { delete: false, type: "string"  };
this._dictionary.___pre_op_petct___common_hepatic_art___thrombosis 					= { delete: false, type: "string"  };
this._dictionary.___damage_to_lymph_nodes 											= { delete: false, type: "string"  };
this._dictionary.___distant_metastases 												= { delete: false, type: "string"  };
this._dictionary.___liver 															= { delete: false, type: "string"  };
this._dictionary.___lungs 															= { delete: false, type: "string"  };
this._dictionary.___peritoneum 														= { delete: false, type: "string"  };
this._dictionary.___other 															= { delete: true , type: "string"  };
this._dictionary.___other___another_option 											= { delete: true , type: "string"  };
this._dictionary.___pre_op_lab_ca_level_19 											= { delete: false, type: "float32" };
this._dictionary.___bilirubin_level_at_operation 									= { delete: false, type: "float32" };
this._dictionary.___pre_op_lab_rea 													= { delete: false, type: "float32" };
this._dictionary.___pre_op_lab_nse 													= { delete: false, type: "float32" };
this._dictionary.___pre_op_lab_chromo 												= { delete: false, type: "float32" };
this._dictionary.___pre_op_lab_serot 												= { delete: false, type: "float32" };
this._dictionary.___drainage 														= { delete: false, type: "string"  };
this._dictionary.___drainage___drainage_options 									= { delete: false, type: "string"  };
this._dictionary.___neoadj_chemo 													= { delete: false, type: "string"  };
this._dictionary.___neoadj_chemo___scheme_name 										= { delete: false, type: "string"  };
this._dictionary.___neoadj_chemo___scheme_quantity 									= { delete: false, type: "int32"   };
this._dictionary.___neoadj_chemo___start_date 										= { delete: false, type: "date"    };
this._dictionary.___neoadj_chemo___finish_date 										= { delete: false, type: "date"    };
this._dictionary.___neoadj_chemo___adverse_event 									= { delete: false, type: "string"  };
this._dictionary.___ray_therapy 													= { delete: false, type: "string"  };
this._dictionary.___ray_therapy___another_option 									= { delete: true , type: "string"  };
this._dictionary.___brachi_therapy 													= { delete: false, type: "string"  };
this._dictionary.___brachi_therapy___another_option 								= { delete: true , type: "string"  };
this._dictionary.___loko_therapy 													= { delete: false, type: "string"  };
this._dictionary.___loko_therapy___another_option 									= { delete: true , type: "string"  };
this._dictionary.___ct_post_adj_therapy 											= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___portal_vein 								= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___sup_mesent_vein 							= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___venous_confluence 						= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___top_branches 								= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___portal_vein___lesion_volume 				= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___portal_vein___roughness_contour 			= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___portal_vein___envasion_extent 			= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___portal_vein___thrombosis 					= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___sup_mesent_vein___lesion_volume 			= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___sup_mesent_vein___roughness_contour 		= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___sup_mesent_vein___envasion_extent 		= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___sup_mesent_vein___thrombosis 				= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___venous_confluence___lesion_volume 		= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___venous_confluence___roughness_contour 	= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___venous_confluence___envasion_extent 		= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___venous_confluence___thrombosis 			= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___top_branches___lesion_volume 				= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___top_branches___roughness_contour 			= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___top_branches___envasion_extent 			= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___top_branches___thrombosis 				= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___sup_mesent_artery 						= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___celiac_trunk 								= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___common_hepatic_art 						= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___sup_mesent_artery___lesion_volume 		= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___sup_mesent_artery___roughness_contour 	= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___sup_mesent_artery___envasion_extent 		= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___sup_mesent_artery___thrombosis 			= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___celiac_trunk___lesion_volume 				= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___celiac_trunk___roughness_contour 			= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___celiac_trunk___envasion_extent 			= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___celiac_trunk___thrombosis 				= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___common_hepatic_art___lesion_volume 		= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___common_hepatic_art___roughness_contour 	= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___common_hepatic_art___envasion_extent 		= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___common_hepatic_art___thrombosis 			= { delete: false, type: "string"  };
this._dictionary.___ct_post_adj_therapy___recist 									= { delete: false, type: "string"  };
this._dictionary.___op_done 														= { delete: false, type: "string"  };
this._dictionary.___op_done___invasion_date 										= { delete: false, type: "date"    };
this._dictionary.___op_done___operation_type 										= { delete: false, type: "string"  };
this._dictionary.___op_done___operation_class 										= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect 											= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___portal_vein 							= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___sup_mesent_vein 						= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___venous_confluence 						= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___top_branches 							= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___portal_vein___resect_type 				= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___portal_vein___resect_extent 			= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___sup_mesent_vein___resect_type 			= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___sup_mesent_vein___resect_extent 		= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___venous_confluence___resect_type 		= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___venous_confluence___resect_extent 		= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___top_branches___resect_type 				= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___top_branches___resect_extent 			= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___sup_mesent_artery 						= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___celiac_trunk 							= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___common_hepatic_art 						= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___sup_mesent_artery___resect_type 		= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___sup_mesent_artery___resect_extent 		= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___celiac_trunk___resect_type 				= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___celiac_trunk___resect_extent 			= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___common_hepatic_art___resect_type 		= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___common_hepatic_art___resect_extent 		= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___left_hepatic_art 						= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___left_hepatic_art___resect_type	 		= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___left_hepatic_art___resect_extent 		= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___right_hepatic_art 						= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___right_hepatic_art___resect_type 		= { delete: false, type: "string"  };
this._dictionary.___op_done___vasc_resect___right_hepatic_art___resect_extent 		= { delete: false, type: "string"  };
this._dictionary.___op_done___blood_loss									 		= { delete: false, type: "string"  };
this._dictionary.___op_done___blood_transfusion								 		= { delete: false, type: "string"  };
this._dictionary.___op_done___assistant										 		= { delete: true , type: "string"  };
this._dictionary.___op_done___duration										 		= { delete: false, type: "string"  };
this._dictionary.___op_done___recovery_days									 		= { delete: false, type: "string"  };
this._dictionary.___another_organ_resect 											= { delete: false, type: "string"  };
this._dictionary.___another_organ_resect___liver 									= { delete: false, type: "string"  };
this._dictionary.___another_organ_resect___colon 									= { delete: false, type: "string"  };
this._dictionary.___another_organ_resect___bud 										= { delete: false, type: "string"  };
this._dictionary.___another_organ_resect___other 									= { delete: true , type: "string"  };
this._dictionary.___another_organ_resect___other___another_option 					= { delete: true , type: "string"  };
this._dictionary.___complications 													= { delete: false, type: "string"  };
this._dictionary.___complications___clavien_dindo_complications 					= { delete: false, type: "string"  };
this._dictionary.___pancreatic_fistula 												= { delete: false, type: "string"  };
this._dictionary.___differentiation_level 											= { delete: false, type: "string"  };
this._dictionary.___cancer_size 													= { delete: false, type: "string"  };
this._dictionary.___lymph_node_damage 												= { delete: false, type: "string"  };
this._dictionary.___lymph_node_damage___number_lymph_node_damage 					= { delete: false, type: "int32"   };
this._dictionary.___separate_metastases 											= { delete: false, type: "string"  };
this._dictionary.___resect_edge_type_r1 											= { delete: false, type: "string"  };
this._dictionary.___resect_edge_type_r1___front 									= { delete: false, type: "string"  };
this._dictionary.___resect_edge_type_r1___back 										= { delete: false, type: "string"  };
this._dictionary.___resect_edge_type_r1___medial 									= { delete: false, type: "string"  };
this._dictionary.___resect_edge_type_r1___top 										= { delete: false, type: "string"  };
this._dictionary.___vascular_growing 												= { delete: false, type: "string"  };
this._dictionary.___vascular_growing___vascular_type_artery 						= { delete: false, type: "string"  };
this._dictionary.___vascular_growing___vascular_type_artery___invasion_level 		= { delete: false, type: "string"  };
this._dictionary.___vascular_growing___vascular_type_vein 							= { delete: false, type: "string"  };
this._dictionary.___vascular_growing___vascular_type_vein___invasion_level 			= { delete: false, type: "string"  };
this._dictionary.___preneural_invasion 												= { delete: false, type: "string"  };
this._dictionary.___neoadj_chemo___idworak 											= { delete: false, type: "string"  };
this._dictionary.___adjuvant_chemotherapy_conduct 									= { delete: false, type: "string"  };
this._dictionary.___adjuvant_chemotherapy_conduct___scheme_name 					= { delete: false, type: "string"  };
this._dictionary.___adjuvant_chemotherapy_conduct___scheme_quantity 				= { delete: false, type: "string"  };
this._dictionary.___adjuvant_chemotherapy_conduct___start_date 						= { delete: false, type: "date"    };
this._dictionary.___adjuvant_chemotherapy_conduct___finish_date 					= { delete: false, type: "date"    };
this._dictionary.___adjuvant_chemotherapy_conduct___adverse_event 					= { delete: false, type: "string"  };
this._dictionary.___relapse_date 													= { delete: false, type: "date"    };
this._dictionary.___relapse_biochemical 											= { delete: false, type: "string"  };
this._dictionary.___relapse_metastases 												= { delete: false, type: "string"  };
this._dictionary.___relapse_metastases___liver 										= { delete: false, type: "string"  };
this._dictionary.___relapse_metastases___lungs 										= { delete: false, type: "string"  };
this._dictionary.___relapse_metastases___peritoneum 								= { delete: false, type: "string"  };
this._dictionary.___relapse_metastases___other 										= { delete: true , type: "string"  };
this._dictionary.___relapse_metastases___other___another_option 					= { delete: true , type: "string"  };
this._dictionary.___relapse_local 													= { delete: false, type: "string"  };
this._dictionary.___relapse_local___chemo_therapy 									= { delete: false, type: "string"  };
this._dictionary.___relapse_local___chemo_therapy___second_line 					= { delete: false, type: "string"  };
this._dictionary.___relapse_local___chemo_therapy___second_line___scheme_name 		= { delete: false, type: "string"  };
this._dictionary.___relapse_local___chemo_therapy___second_line___scheme_quantity 	= { delete: false, type: "int32"   };
this._dictionary.___relapse_local___chemo_therapy___second_line___start_date 		= { delete: false, type: "date"    };
this._dictionary.___relapse_local___chemo_therapy___second_line___finish_date 		= { delete: false, type: "date"    };
this._dictionary.___relapse_local___chemo_therapy___second_line___adverse_event 	= { delete: false, type: "string"  };
this._dictionary.___relapse_local___chemo_therapy___third_line 						= { delete: false, type: "string"  };
this._dictionary.___relapse_local___chemo_therapy___third_line___scheme_name 		= { delete: false, type: "string"  };
this._dictionary.___relapse_local___chemo_therapy___third_line___scheme_quantity 	= { delete: false, type: "string"  };
this._dictionary.___relapse_local___chemo_therapy___third_line___start_date 		= { delete: false, type: "date"    };
this._dictionary.___relapse_local___chemo_therapy___third_line___finish_date 		= { delete: false, type: "date"    };
this._dictionary.___relapse_local___chemo_therapy___third_line___adverse_event 		= { delete: false, type: "string"  };
this._dictionary.___relapse_local___syrgical_treatment 								= { delete: false, type: "string"  };
this._dictionary.___relapse_local___xray_therapy 									= { delete: false, type: "string"  };
this._dictionary.___study_retirement_date 											= { delete: true , type: "date"    };
this._dictionary.___death_date 														= { delete: false, type: "date"    };
	}


	// Check if all fields from parameter are present in dictionary
	// input: object with all medical fields
	// output: object containing error
	_CheckConsistency(record) {
		let error;

		for (let field_name in record) {
			if(field_name.indexOf("___") == 0) {
				if(this._dictionary[field_name] == undefined) {
					error = new Error(`field ${field_name} is not in dictionary`);
					break;
				} 
			}
		}

		return {error: error}
	}

	// consistency checking function
	_CheckIfAllNecessaryColumnsExists(df) {
		let error;
		let columns = this._Y_reference.slice();
		columns.push("___birthdate");
		columns.push("___death_date");

		for (let column of columns) {
			if(df.$columns.indexOf(column) == -1) {
				error = new Error(`column ${column} is not in the DataFrame`);
				console.error(error);
				break;
			}
		}

		return error;
	}

	_IsColumnShouldBeDeleted(column) {
		if((this._dictionary[column] != undefined) && (this._dictionary[column].delete == true)) {
				return true;
		}

		return false;
	}

	// --- Delete columns configured in dictionary
	// --- and non-medical (not prefixed by ___)
	_DeleteConfiguredColumns(df) {
		let columns = df.$columns.slice(); // --- copy array
		let drop_columns = [];

		columns.forEach(column => {
			if(column.indexOf("___") == 0) {
				if(this._IsColumnShouldBeDeleted(column)) {
					drop_columns.push(column);
				}
			} else {
				drop_columns.push(column);
			}
		})

		drop_columns = [... new Set(drop_columns)];

		let new_df = df.drop({columns: drop_columns});

		return new_df;
	}

	// --- Delete columns if empty
	_DeleteEmptyColumns(df, inference = 0) {
		if(inference == 0) {
			// --- training cycle
			let unique_values = df.nUnique(0);

			for(let i = 0; i < unique_values.$data.length; ++i) {
				if(unique_values.$data[i] == 1) {
					this._drop_columns.push(unique_values.$index[i]);
				}
			}

			this._drop_columns = [... new Set(this._drop_columns)];
		}

		let new_df = df.drop({columns: this._drop_columns});

		return new_df;
	}

	// --- Delete rows if value in y_column is empty
	_DeleteEmptyRows(df, y_column) {
		let idxs = df[y_column].ne("");
		let error = null;

		return { df: df.loc({ rows: idxs }), error: error };
	}

	// --- Assign types from dictionary to DataFrame columns
	_AssignConfiguredTypes(df) {
		let new_df = df.copy();
		let columns = df.$columns.slice();
		let error = null;

		columns.forEach(column => {
			let type = this._dictionary[column].type;
			if(type != "date") {
				new_df = new_df.asType(column, type);
			} else {
				new_df = new_df.asType(column, "string");
			}
		});

		return {df: new_df, error: error};
	}

	// --- Creates list of active string-typed columns from df
	// 		input:	df - source df
	_InventoryStringColumns(df) {
		let columns = df.$columns.slice();

		columns.forEach(column => {
			if(this._dictionary[column].type == "string") {
				this._string_columns.push(column);
			}
		})
	}

	// --- Creates list of active date-typed columns from df
	// 		input:	df - source df
	_InventoryDateColumns(df) {
		let columns = df.$columns.slice();

		columns.forEach(column => {
			if(this._dictionary[column].type == "date") {
				this._date_columns.push(column);
			}
		})
	}

	// --- Move string-types columns to dictionary
	//		input:	source df containing mix of numeric, date and string values
	//		output:	df containing non-string columns only
	_CreateStringEncoder(df) {
		this._string_columns.forEach(column => {
			let encoder = new dfd.LabelEncoder();

			// --- save encoder to dictionary
			encoder.fit(df[column])
			this._dictionary[column].encoder = encoder;
		})
	}

	_MonthsDiff(column_name) {
		return function (row) {
			let diff = 0;

			if((row[0].length > 0) && (row[1].length > 0)) {
				let d1 = new Date(row[0] + " 00:00:00");
				let d2 = new Date(row[1] + " 00:00:00");

				diff = system_calls.MonthsDiff(d1, d2);

				if(column_name == "___neoadj_chemo___start_date") {
					console.debug(column_name, row, diff)
				}
			}
			return diff;
		} 
	}


	// --- Convert date-columns to months
	//		input:	source df containing date-typed columns
	//		output: df containing numeric only
	_ConvertDateToNumbers(df) {
		let	error = null;
		let new_df = df.copy();

		this._date_columns.forEach(column => {
			if(column != "___birthdate") {
				let month_diff_closure = this._MonthsDiff(column);
				let temp_df = df.loc({ columns: ["___birthdate", column] }).apply(month_diff_closure, { axis: 1 });

				new_df = new_df.drop({ columns: [column]});
				new_df = new_df.addColumn(column, temp_df.values);
			}
		});

		// birthdate column removed due to it is a reference point and always 0
		new_df = new_df.drop({ columns: ["___birthdate"] })

		return {df: new_df, error: error};
	}

	_RemoveDeathDate(df) {
		// death date must be predicted and unknown in the inference stage
		let new_df = df.drop({ columns: [this._death_column]});

		return {df: new_df}
	}

	_Normalize(df, inference = 0) {
		let error = null;
		let nona_df = df.fillNa(0);
		let result = nona_df.copy();

		for (let column of df.$columns) {
			if(inference == 0) {
				this._dictionary[column]._scaler = new dfd.MinMaxScaler();
				this._dictionary[column]._scaler.fit(nona_df[column]);
			}

			let scaled_column = this._dictionary[column]._scaler.transform(nona_df[column].asType("float32"));

			result = result.drop({ columns: [column] })
			result = result.addColumn(column, scaled_column.values)
		}

		return {df: result, error: error };
	}

	// function returns new DataFrame containing rows with non-empty value in either of input columns
	_KeepRowsWithNonEmptyValues(df, columns) {
		let error = null;
		let empty_idxs = null;

		for (let i = 0; i < columns.length; ++i) {
			if(empty_idxs == null) {
				empty_idxs = df[columns[i]].eq("");
			} else {
				empty_idxs = empty_idxs.mul(df[columns[i]].eq(""));
			}
		}

		let non_empty_idxs = empty_idxs.eq(0);
		let result = df.loc({ rows: non_empty_idxs });

		return {df: result, error: error};
	}

	// function returns difference in month between "Y reference" columns and death date
	// death date must be the last column in the row
	_LifeExpectancyInMonths(inference) {
		return function(row) {
			let death_idx = row.length - 1;
			let result = 0;

			for(let i = 0; i < row.length - 1; ++i) {
				if(row[i] > 0) {
					result = row[death_idx] - row[i];
					break;
				}
			}

			if((inference == 1) || (row[death_idx] > 0)) {
				// do not report error 
				// 1) at the inference stage
				// 2) if patient died same month as an invasion month
			} else {
				if(result < 0) {
					result = 0;
					console.error("death date is earlier than any other date")
				} else if(result == 0) {
					// to find entries reported by this line use the following query in MySQL:
					// select `id`,`___first_name`, `___last_name`, `___op_done___invasion_date`, `___death_date` from `medical_records` where `___op_done___invasion_date`<>"" and `___death_date`<>"" and substring(___op_done___invasion_date, 1, 7)=substring(___death_date, 1, 7)
					console.error("missing dates in Y reference columns")
				}
			}

			return result;
		}
	}

	_ExtractY(df, inference = 0) {
		let columns = this._Y_reference.slice();
		columns.push(this._death_column);
		let temp_Y_df = df.loc({ columns: columns }).apply(this._LifeExpectancyInMonths(inference), { axis: 1 });

		let Y		= temp_Y_df.values;
		let error	= null;

		if(inference == 0){
			let sc		= new dfd.MinMaxScaler();

			sc.fit(Y);
			this._y_column_scaler = sc;
		}

		return {Y: this._y_column_scaler.transform(Y), error: error};
	}

	_DeleteStringColumns(df) {
		let new_df = df.copy();

		this._string_columns.forEach(column => {
			new_df = new_df.drop({ columns: [column] });
		});

		return new_df;
	}

	_EncodeStringColumns(df) {
		let error = null;
		let number_of_rows = df[df['$columns'][0]].size;
		let temp_array = [...Array(number_of_rows).keys()];
		let encodings = new dfd.DataFrame({ temp_col: temp_array });

		this._string_columns.forEach(column => {
			let encoding = this._dictionary[column].encoder.transform(df[column]);
			encodings = encodings.addColumn(column, encoding.values);
		});

		this._string_columns.forEach(column => {
			df = df.drop({ columns: [column] });
		});

		encodings = encodings.drop({ columns: ["temp_col"] });

		return {df: df, encodings: encodings, error: error};
	}

	_ExtractX(df, encodings) {
		let X = []
		let error = null

		// --- push numeric columns into first row.
		X.push(df.values)

		this._string_columns.forEach(column => {
			X.push(encodings[column].values);
		});

		return {X: X, error: error};
	}

	_fit_inference(records, _inference) {
		let error = null;

		let result = this._CheckConsistency(records[0]);
		if(result.error instanceof Error) {
			console.error(result.error);
			return {error: result.error};
		}

		let source_df = new dfd.DataFrame(records);

		let cleaned_df1 = this._DeleteConfiguredColumns(source_df);

		let typed_result = this._AssignConfiguredTypes(cleaned_df1);
		if(typed_result.error instanceof Error) {
			return {error: typed_result.error};
		}

		let cleaned_df3 = null;

		if(_inference == 1) {
			// inference mode
			cleaned_df3 = this._DeleteEmptyColumns(typed_result.df, _inference);
		} else {
			// fit mode 
			let deceased_patients = this._DeleteEmptyRows(typed_result.df, this._death_column);
			if(deceased_patients.error instanceof Error) {
				return {error: deceased_patients.error};
			}
	
			let relevant_patients = this._KeepRowsWithNonEmptyValues(deceased_patients.df, this._Y_reference);
			if(relevant_patients.error instanceof Error) {
				return {error: relevant_patients.error};
			}

			cleaned_df3 = this._DeleteEmptyColumns(deceased_patients.df, _inference);

			let err = this._CheckIfAllNecessaryColumnsExists(cleaned_df3);
			if(err instanceof Error) {
				return {error: err};
			}
	
			this._InventoryStringColumns(cleaned_df3);
			this._InventoryDateColumns(cleaned_df3);
	
			this._CreateStringEncoder(cleaned_df3);
		}

		let non_string_result = this._EncodeStringColumns(cleaned_df3);
		if(non_string_result.error instanceof Error) {
			return {error: non_string_result.error};
		}

		let numeric_result = this._ConvertDateToNumbers(non_string_result.df);
		if(numeric_result.error instanceof Error) {
			return {error: numeric_result.error};
		}

		let extractY_result = this._ExtractY(numeric_result.df, _inference);
		if(extractY_result.error instanceof Error) {
			return {error: extractY_result.error};
		}
		let Y = extractY_result.Y

		let normalized_result = this._Normalize(numeric_result.df, _inference);
		if(normalized_result.error instanceof Error) {
			return {error: normalized_result.error};
		}

		let normalized_no_death = this._RemoveDeathDate(normalized_result.df);

		let final_result = this._ExtractX(normalized_no_death.df, non_string_result.encodings);
		if(final_result.error instanceof Error) {
			return {error: final_result.error};
		}

		let X = final_result.X

		return {X: X, Y: Y, error: error};
	}

	fit(records) {
		return this._fit_inference(records, 0);
	}

	inference(records) {
		return this._fit_inference(records, 1);
	}

	GetDateByY(record, Y) {
		let	  dates			= [];

		for (var i = Y.length - 1; i >= 0; i--) {
			
			for(let y_column of this._Y_reference) {
				if(record[y_column] == "") {
					// date is missing in the column
					// nothing to do
				} else {
					const scaler		= this._y_column_scaler;

					const initial_date	= new Date(record[y_column] + " 00:00:00");
					const months		= scaler.inverseTransform([Y[i]]);
		
					const final_ts		= initial_date.setMonth(initial_date.getMonth() + months[0]);
					const final_date	= new Date(final_ts);
		
					dates.push(final_date);
					break;
				}
			}
		}

		return dates;
	}
}
