<?php
/**
 * Tests the dynamic OD Shuffle renderer.
 *
 * @package OD_Shuffle_Block
 */

/**
 * Tests the public rendering contract.
 */
class OD_Shuffle_Block_Render_Test extends WP_UnitTestCase {
	/**
	 * Creates serialized Shuffle Item candidates.
	 *
	 * @param string[] $markers Candidate marker values.
	 * @return string
	 */
	private function get_candidates_markup( array $markers ) {
		$markup = '';

		foreach ( $markers as $marker ) {
			$markup .= sprintf(
				'<!-- wp:od/shuffle-item --><!-- wp:paragraph --><p><span data-candidate="%1$s">%1$s</span></p><!-- /wp:paragraph --><!-- /wp:od/shuffle-item -->',
				esc_attr( $marker )
			);
		}

		return $markup;
	}

	/**
	 * Renders serialized candidates through the registered dynamic block.
	 *
	 * @param string[] $markers Candidate marker values.
	 * @return string
	 */
	private function render_shuffle( array $markers ) {
		return do_blocks(
			'<!-- wp:od/shuffle {"className":"render-contract"} -->' .
			$this->get_candidates_markup( $markers ) .
			'<!-- /wp:od/shuffle -->'
		);
	}

	/**
	 * Ensures each render contains exactly one known candidate.
	 *
	 * @return void
	 */
	public function test_renders_exactly_one_candidate() {
		$markers = array( 'CANDIDATE_A', 'CANDIDATE_B', 'CANDIDATE_C' );

		for ( $iteration = 0; $iteration < 20; $iteration++ ) {
			$output = $this->render_shuffle( $markers );

			$this->assertSame( 1, substr_count( $output, 'data-candidate=' ) );
			$this->assertSame(
				1,
				count(
					array_filter(
						$markers,
						static function ( $marker ) use ( $output ) {
							return false !== strpos( $output, $marker );
						}
					)
				)
			);
		}
	}

	/**
	 * Ensures candidate containers are not emitted on the front end.
	 *
	 * @return void
	 */
	public function test_omits_shuffle_item_wrappers() {
		$output = $this->render_shuffle( array( 'CANDIDATE_A', 'CANDIDATE_B' ) );

		$this->assertStringNotContainsString( 'wp-block-od-shuffle-item', $output );
		$this->assertStringNotContainsString( 'od-shuffle-item', $output );
	}

	/**
	 * Ensures the parent wrapper keeps block support attributes.
	 *
	 * @return void
	 */
	public function test_preserves_parent_wrapper_attributes() {
		$output = $this->render_shuffle( array( 'CANDIDATE_A' ) );

		$this->assertStringContainsString( 'wp-block-od-shuffle', $output );
		$this->assertStringContainsString( 'render-contract', $output );
	}

	/**
	 * Ensures an empty Shuffle block emits no wrapper or content.
	 *
	 * @return void
	 */
	public function test_empty_shuffle_emits_nothing() {
		$this->assertSame(
			'',
			do_blocks( '<!-- wp:od/shuffle --><!-- /wp:od/shuffle -->' )
		);
	}
}
