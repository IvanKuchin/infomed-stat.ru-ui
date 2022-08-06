import DataPrepDictionary from "./dictionary.js"

export default class DatasetPreprocess {
	_medical_records = [];
	_dictionary = {};

	constructor(arr1) {
		this._medical_records = arr1;

this._dictionary.___last_name 														= { delete: true  };
this._dictionary.___first_name 														= { delete: true  };
this._dictionary.___middle_name 													= { delete: true  };
this._dictionary.___medical_history_number 											= { delete: true  };
this._dictionary.___phone 															= { delete: true  };
this._dictionary.___birthdate 														= { delete: false };
this._dictionary.___zip_code 														= { delete: true  };
this._dictionary.___region 															= { delete: true  };
this._dictionary.___locality 														= { delete: true  };
this._dictionary.___comment 														= { delete: true  };
this._dictionary.___cancer_type 													= { delete: false };
this._dictionary.___non_pancreatobiliary_sickness 									= { delete: false };
this._dictionary.___resectability 													= { delete: false };
this._dictionary.___brca 															= { delete: false };	
this._dictionary.___brca_localization_breast 										= { delete: false };
this._dictionary.___brca_localization_ovaries 										= { delete: false };
this._dictionary.___pre_op 															= { delete: false };
this._dictionary.___pre_op_ct___portal_vein 										= { delete: false };
this._dictionary.___pre_op_ct___sup_mesent_vein 									= { delete: false };
this._dictionary.___pre_op_ct___venous_confluence 									= { delete: false };
this._dictionary.___pre_op_ct___top_branches 										= { delete: false };
this._dictionary.___pre_op_ct___portal_vein___lesion_volume 						= { delete: false };
this._dictionary.___pre_op_ct___portal_vein___roughness_contour 					= { delete: false };
this._dictionary.___pre_op_ct___portal_vein___envasion_extent 						= { delete: false };
this._dictionary.___pre_op_ct___portal_vein___thrombosis 							= { delete: false };
this._dictionary.___pre_op_ct___sup_mesent_vein___lesion_volume 					= { delete: false };
this._dictionary.___pre_op_ct___sup_mesent_vein___roughness_contour 				= { delete: false };
this._dictionary.___pre_op_ct___sup_mesent_vein___envasion_extent 					= { delete: false };
this._dictionary.___pre_op_ct___sup_mesent_vein___thrombosis 						= { delete: false };
this._dictionary.___pre_op_ct___venous_confluence___lesion_volume 					= { delete: false };
this._dictionary.___pre_op_ct___venous_confluence___roughness_contour 				= { delete: false };
this._dictionary.___pre_op_ct___venous_confluence___envasion_extent 				= { delete: false };
this._dictionary.___pre_op_ct___venous_confluence___thrombosis 						= { delete: false };
this._dictionary.___pre_op_ct___top_branches___lesion_volume 						= { delete: false };
this._dictionary.___pre_op_ct___top_branches___roughness_contour 					= { delete: false };
this._dictionary.___pre_op_ct___top_branches___envasion_extent 						= { delete: false };
this._dictionary.___pre_op_ct___top_branches___thrombosis 							= { delete: false };
this._dictionary.___pre_op_ct___sup_mesent_artery 									= { delete: false };
this._dictionary.___pre_op_ct___celiac_trunk 										= { delete: false };
this._dictionary.___pre_op_ct___common_hepatic_art 									= { delete: false };
this._dictionary.___pre_op_ct___sup_mesent_artery___lesion_volume 					= { delete: false };
this._dictionary.___pre_op_ct___sup_mesent_artery___roughness_contour 				= { delete: false };
this._dictionary.___pre_op_ct___sup_mesent_artery___envasion_extent 				= { delete: false };
this._dictionary.___pre_op_ct___sup_mesent_artery___thrombosis 						= { delete: false };
this._dictionary.___pre_op_ct___celiac_trunk___lesion_volume 						= { delete: false };
this._dictionary.___pre_op_ct___celiac_trunk___roughness_contour 					= { delete: false };
this._dictionary.___pre_op_ct___celiac_trunk___envasion_extent 						= { delete: false };
this._dictionary.___pre_op_ct___celiac_trunk___thrombosis 							= { delete: false };
this._dictionary.___pre_op_ct___common_hepatic_art___lesion_volume 					= { delete: false };
this._dictionary.___pre_op_ct___common_hepatic_art___roughness_contour 				= { delete: false };
this._dictionary.___pre_op_ct___common_hepatic_art___envasion_extent 				= { delete: false };
this._dictionary.___pre_op_ct___common_hepatic_art___thrombosis 					= { delete: false };
this._dictionary.___pre_op_petct___portal_vein 										= { delete: false };
this._dictionary.___pre_op_petct___sup_mesent_vein 									= { delete: false };
this._dictionary.___pre_op_petct___venous_confluence 								= { delete: false };
this._dictionary.___pre_op_petct___top_branches 									= { delete: false };
this._dictionary.___pre_op_petct___portal_vein___lesion_volume 						= { delete: false };
this._dictionary.___pre_op_petct___portal_vein___roughness_contour 					= { delete: false };
this._dictionary.___pre_op_petct___portal_vein___envasion_extent 					= { delete: false };
this._dictionary.___pre_op_petct___portal_vein___thrombosis 						= { delete: false };
this._dictionary.___pre_op_petct___sup_mesent_vein___lesion_volume 					= { delete: false };
this._dictionary.___pre_op_petct___sup_mesent_vein___roughness_contour 				= { delete: false };
this._dictionary.___pre_op_petct___sup_mesent_vein___envasion_extent 				= { delete: false };
this._dictionary.___pre_op_petct___sup_mesent_vein___thrombosis 					= { delete: false };
this._dictionary.___pre_op_petct___venous_confluence___lesion_volume 				= { delete: false };
this._dictionary.___pre_op_petct___venous_confluence___roughness_contour 			= { delete: false };
this._dictionary.___pre_op_petct___venous_confluence___envasion_extent 				= { delete: false };
this._dictionary.___pre_op_petct___venous_confluence___thrombosis 					= { delete: false };
this._dictionary.___pre_op_petct___top_branches___lesion_volume 					= { delete: false };
this._dictionary.___pre_op_petct___top_branches___roughness_contour 				= { delete: false };
this._dictionary.___pre_op_petct___top_branches___envasion_extent 					= { delete: false };
this._dictionary.___pre_op_petct___top_branches___thrombosis 						= { delete: false };
this._dictionary.___pre_op_petct___sup_mesent_artery 								= { delete: false };
this._dictionary.___pre_op_petct___celiac_trunk 									= { delete: false };
this._dictionary.___pre_op_petct___common_hepatic_art 								= { delete: false };
this._dictionary.___pre_op_petct___sup_mesent_artery___lesion_volume 				= { delete: false };
this._dictionary.___pre_op_petct___sup_mesent_artery___roughness_contour 			= { delete: false };
this._dictionary.___pre_op_petct___sup_mesent_artery___envasion_extent 				= { delete: false };
this._dictionary.___pre_op_petct___sup_mesent_artery___thrombosis 					= { delete: false };
this._dictionary.___pre_op_petct___celiac_trunk___lesion_volume 					= { delete: false };
this._dictionary.___pre_op_petct___celiac_trunk___roughness_contour 				= { delete: false };
this._dictionary.___pre_op_petct___celiac_trunk___envasion_extent 					= { delete: false };
this._dictionary.___pre_op_petct___celiac_trunk___thrombosis 						= { delete: false };
this._dictionary.___pre_op_petct___common_hepatic_art___lesion_volume 				= { delete: false };
this._dictionary.___pre_op_petct___common_hepatic_art___roughness_contour 			= { delete: false };
this._dictionary.___pre_op_petct___common_hepatic_art___envasion_extent 			= { delete: false };
this._dictionary.___pre_op_petct___common_hepatic_art___thrombosis 					= { delete: false };
this._dictionary.___damage_to_lymph_nodes 											= { delete: false };
this._dictionary.___distant_metastases 												= { delete: false };
this._dictionary.___liver 															= { delete: false };
this._dictionary.___lungs 															= { delete: false };
this._dictionary.___peritoneum 														= { delete: false };
this._dictionary.___other 															= { delete: true  };
this._dictionary.___other___another_option 											= { delete: true  };
this._dictionary.___pre_op_lab_ca_level_19 											= { delete: false };
this._dictionary.___bilirubin_level_at_operation 									= { delete: false };
this._dictionary.___pre_op_lab_rea 													= { delete: false };
this._dictionary.___pre_op_lab_nse 													= { delete: false };
this._dictionary.___pre_op_lab_chromo 												= { delete: false };
this._dictionary.___pre_op_lab_serot 												= { delete: false };
this._dictionary.___drainage 														= { delete: false };
this._dictionary.___drainage___drainage_options 									= { delete: false };
this._dictionary.___neoadj_chemo 													= { delete: false };
this._dictionary.___neoadj_chemo___scheme_name 										= { delete: false };
this._dictionary.___neoadj_chemo___scheme_quantity 									= { delete: false };
this._dictionary.___neoadj_chemo___start_date 										= { delete: false };
this._dictionary.___neoadj_chemo___finish_date 										= { delete: false };
this._dictionary.___neoadj_chemo___adverse_event 									= { delete: false };
this._dictionary.___ray_therapy 													= { delete: false };
this._dictionary.___ray_therapy___another_option 									= { delete: true  };
this._dictionary.___brachi_therapy 													= { delete: false };
this._dictionary.___brachi_therapy___another_option 								= { delete: true  };
this._dictionary.___loko_therapy 													= { delete: false };
this._dictionary.___loko_therapy___another_option 									= { delete: true  };
this._dictionary.___ct_post_adj_therapy 											= { delete: false };
this._dictionary.___ct_post_adj_therapy___portal_vein 								= { delete: false };
this._dictionary.___ct_post_adj_therapy___sup_mesent_vein 							= { delete: false };
this._dictionary.___ct_post_adj_therapy___venous_confluence 						= { delete: false };
this._dictionary.___ct_post_adj_therapy___top_branches 								= { delete: false };
this._dictionary.___ct_post_adj_therapy___portal_vein___lesion_volume 				= { delete: false };
this._dictionary.___ct_post_adj_therapy___portal_vein___roughness_contour 			= { delete: false };
this._dictionary.___ct_post_adj_therapy___portal_vein___envasion_extent 			= { delete: false };
this._dictionary.___ct_post_adj_therapy___portal_vein___thrombosis 					= { delete: false };
this._dictionary.___ct_post_adj_therapy___sup_mesent_vein___lesion_volume 			= { delete: false };
this._dictionary.___ct_post_adj_therapy___sup_mesent_vein___roughness_contour 		= { delete: false };
this._dictionary.___ct_post_adj_therapy___sup_mesent_vein___envasion_extent 		= { delete: false };
this._dictionary.___ct_post_adj_therapy___sup_mesent_vein___thrombosis 				= { delete: false };
this._dictionary.___ct_post_adj_therapy___venous_confluence___lesion_volume 		= { delete: false };
this._dictionary.___ct_post_adj_therapy___venous_confluence___roughness_contour 	= { delete: false };
this._dictionary.___ct_post_adj_therapy___venous_confluence___envasion_extent 		= { delete: false };
this._dictionary.___ct_post_adj_therapy___venous_confluence___thrombosis 			= { delete: false };
this._dictionary.___ct_post_adj_therapy___top_branches___lesion_volume 				= { delete: false };
this._dictionary.___ct_post_adj_therapy___top_branches___roughness_contour 			= { delete: false };
this._dictionary.___ct_post_adj_therapy___top_branches___envasion_extent 			= { delete: false };
this._dictionary.___ct_post_adj_therapy___top_branches___thrombosis 				= { delete: false };
this._dictionary.___ct_post_adj_therapy___sup_mesent_artery 						= { delete: false };
this._dictionary.___ct_post_adj_therapy___celiac_trunk 								= { delete: false };
this._dictionary.___ct_post_adj_therapy___common_hepatic_art 						= { delete: false };
this._dictionary.___ct_post_adj_therapy___sup_mesent_artery___lesion_volume 		= { delete: false };
this._dictionary.___ct_post_adj_therapy___sup_mesent_artery___roughness_contour 	= { delete: false };
this._dictionary.___ct_post_adj_therapy___sup_mesent_artery___envasion_extent 		= { delete: false };
this._dictionary.___ct_post_adj_therapy___sup_mesent_artery___thrombosis 			= { delete: false };
this._dictionary.___ct_post_adj_therapy___celiac_trunk___lesion_volume 				= { delete: false };
this._dictionary.___ct_post_adj_therapy___celiac_trunk___roughness_contour 			= { delete: false };
this._dictionary.___ct_post_adj_therapy___celiac_trunk___envasion_extent 			= { delete: false };
this._dictionary.___ct_post_adj_therapy___celiac_trunk___thrombosis 				= { delete: false };
this._dictionary.___ct_post_adj_therapy___common_hepatic_art___lesion_volume 		= { delete: false };
this._dictionary.___ct_post_adj_therapy___common_hepatic_art___roughness_contour 	= { delete: false };
this._dictionary.___ct_post_adj_therapy___common_hepatic_art___envasion_extent 		= { delete: false };
this._dictionary.___ct_post_adj_therapy___common_hepatic_art___thrombosis 			= { delete: false };
this._dictionary.___ct_post_adj_therapy___recist 									= { delete: false };
this._dictionary.___op_done 														= { delete: false };
this._dictionary.___op_done___invasion_date 										= { delete: false };
this._dictionary.___op_done___operation_type 										= { delete: false };
this._dictionary.___op_done___operation_class 										= { delete: false };
this._dictionary.___op_done___vasc_resect 											= { delete: false };
this._dictionary.___op_done___vasc_resect___portal_vein 							= { delete: false };
this._dictionary.___op_done___vasc_resect___sup_mesent_vein 						= { delete: false };
this._dictionary.___op_done___vasc_resect___venous_confluence 						= { delete: false };
this._dictionary.___op_done___vasc_resect___top_branches 							= { delete: false };
this._dictionary.___op_done___vasc_resect___portal_vein___resect_type 				= { delete: false };
this._dictionary.___op_done___vasc_resect___portal_vein___resect_extent 			= { delete: false };
this._dictionary.___op_done___vasc_resect___sup_mesent_vein___resect_type 			= { delete: false };
this._dictionary.___op_done___vasc_resect___sup_mesent_vein___resect_extent 		= { delete: false };
this._dictionary.___op_done___vasc_resect___venous_confluence___resect_type 		= { delete: false };
this._dictionary.___op_done___vasc_resect___venous_confluence___resect_extent 		= { delete: false };
this._dictionary.___op_done___vasc_resect___top_branches___resect_type 				= { delete: false };
this._dictionary.___op_done___vasc_resect___top_branches___resect_extent 			= { delete: false };
this._dictionary.___op_done___vasc_resect___sup_mesent_artery 						= { delete: false };
this._dictionary.___op_done___vasc_resect___celiac_trunk 							= { delete: false };
this._dictionary.___op_done___vasc_resect___common_hepatic_art 						= { delete: false };
this._dictionary.___op_done___vasc_resect___sup_mesent_artery___resect_type 		= { delete: false };
this._dictionary.___op_done___vasc_resect___sup_mesent_artery___resect_extent 		= { delete: false };
this._dictionary.___op_done___vasc_resect___celiac_trunk___resect_type 				= { delete: false };
this._dictionary.___op_done___vasc_resect___celiac_trunk___resect_extent 			= { delete: false };
this._dictionary.___op_done___vasc_resect___common_hepatic_art___resect_type 		= { delete: false };
this._dictionary.___op_done___vasc_resect___common_hepatic_art___resect_extent 		= { delete: false };
this._dictionary.___another_organ_resect 											= { delete: true  };
this._dictionary.___another_organ_resect___liver 									= { delete: true  };
this._dictionary.___another_organ_resect___colon 									= { delete: true  };
this._dictionary.___another_organ_resect___bud 										= { delete: true  };
this._dictionary.___another_organ_resect___other 									= { delete: true  };
this._dictionary.___another_organ_resect___other___another_option 					= { delete: true  };
this._dictionary.___complications 													= { delete: false };
this._dictionary.___complications___clavien_dindo_complications 					= { delete: false };
this._dictionary.___pancreatic_fistula 												= { delete: false };
this._dictionary.___differentiation_level 											= { delete: false };
this._dictionary.___cancer_size 													= { delete: false };
this._dictionary.___lymph_node_damage 												= { delete: false };
this._dictionary.___lymph_node_damage___number_lymph_node_damage 					= { delete: false };
this._dictionary.___separate_metastases 											= { delete: false };
this._dictionary.___resect_edge_type_r1 											= { delete: false };
this._dictionary.___resect_edge_type_r1___front 									= { delete: false };
this._dictionary.___resect_edge_type_r1___back 										= { delete: false };
this._dictionary.___resect_edge_type_r1___medial 									= { delete: false };
this._dictionary.___resect_edge_type_r1___top 										= { delete: false };
this._dictionary.___vascular_growing 												= { delete: false };
this._dictionary.___vascular_growing___vascular_type_artery 						= { delete: false };
this._dictionary.___vascular_growing___vascular_type_artery___invasion_level 		= { delete: false };
this._dictionary.___vascular_growing___vascular_type_vein 							= { delete: false };
this._dictionary.___vascular_growing___vascular_type_vein___invasion_level 			= { delete: false };
this._dictionary.___preneural_invasion 												= { delete: false };
this._dictionary.___neoadj_chemo___idworak 											= { delete: false };
this._dictionary.___adjuvant_chemotherapy_conduct 									= { delete: true  };
this._dictionary.___adjuvant_chemotherapy_conduct___scheme_name 					= { delete: true  };
this._dictionary.___adjuvant_chemotherapy_conduct___scheme_quantity 				= { delete: true  };
this._dictionary.___adjuvant_chemotherapy_conduct___start_date 						= { delete: true  };
this._dictionary.___adjuvant_chemotherapy_conduct___finish_date 					= { delete: true  };
this._dictionary.___adjuvant_chemotherapy_conduct___adverse_event 					= { delete: true  };
this._dictionary.___relapse_date 													= { delete: false };
this._dictionary.___relapse_biochemical 											= { delete: false };
this._dictionary.___relapse_metastases 												= { delete: false };
this._dictionary.___relapse_metastases___liver 										= { delete: false };
this._dictionary.___relapse_metastases___lungs 										= { delete: false };
this._dictionary.___relapse_metastases___peritoneum 								= { delete: false };
this._dictionary.___relapse_metastases___other 										= { delete: true  };
this._dictionary.___relapse_metastases___other___another_option 					= { delete: true  };
this._dictionary.___relapse_local 													= { delete: false };
this._dictionary.___relapse_local___chemo_therapy 									= { delete: false };
this._dictionary.___relapse_local___chemo_therapy___second_line 					= { delete: false };
this._dictionary.___relapse_local___chemo_therapy___second_line___scheme_name 		= { delete: false };
this._dictionary.___relapse_local___chemo_therapy___second_line___scheme_quantity 	= { delete: false };
this._dictionary.___relapse_local___chemo_therapy___second_line___start_date 		= { delete: false };
this._dictionary.___relapse_local___chemo_therapy___second_line___finish_date 		= { delete: false };
this._dictionary.___relapse_local___chemo_therapy___second_line___adverse_event 	= { delete: false };
this._dictionary.___relapse_local___chemo_therapy___third_line 						= { delete: false };
this._dictionary.___relapse_local___chemo_therapy___third_line___scheme_name 		= { delete: false };
this._dictionary.___relapse_local___chemo_therapy___third_line___scheme_quantity 	= { delete: false };
this._dictionary.___relapse_local___chemo_therapy___third_line___start_date 		= { delete: false };
this._dictionary.___relapse_local___chemo_therapy___third_line___finish_date 		= { delete: false };
this._dictionary.___relapse_local___chemo_therapy___third_line___adverse_event 		= { delete: false };
this._dictionary.___relapse_local___syrgical_treatment 								= { delete: false };
this._dictionary.___relapse_local___xray_therapy 									= { delete: false };
this._dictionary.___study_retirement_date 											= { delete: true  };
this._dictionary.___death_date 														= { delete: false };
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

	Do() {
		console.debug(`medical records legth ${this._medical_records.length}`);
		let result = this._CheckConsistency(this._medical_records[0]);
		if(result.error instanceof Error) {
			console.error(result.error)
		}
	}
}
